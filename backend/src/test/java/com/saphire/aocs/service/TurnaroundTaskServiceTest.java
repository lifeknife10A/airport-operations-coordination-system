package com.saphire.aocs.service;

import com.saphire.aocs.dto.TaskDTO;
import com.saphire.aocs.entity.DelayLog;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.TaskStatus;
import com.saphire.aocs.entity.TurnaroundTask;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DelayLogRepository;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.TaskRepository;
import com.saphire.aocs.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Service-layer tests for TurnaroundTaskService. This class held three of the confirmed bugs in
 * the review (fabricated timestamps, the delay-log sequence race, and the silently discarded
 * `notes` parameter) and had zero test coverage of any kind.
 *
 * Written against the REFACTORED TurnaroundTaskService.
 */
@ExtendWith(MockitoExtension.class)
class TurnaroundTaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private FlightRepository flightRepository;
    @Mock private UserRepository userRepository;
    @Mock private DelayLogRepository delayLogRepository;

    @InjectMocks private TurnaroundTaskService taskService;

    private Flight flight() {
        return Flight.builder().flightId(101L).flightNumber("SPH101").build();
    }

    private TurnaroundTask task(TaskStatus status, ZonedDateTime scheduledEnd, ZonedDateTime actualStart) {
        return TurnaroundTask.builder()
                .taskId(500L)
                .flight(flight())
                .taskName("CLEANING")
                .status(status.name())
                .scheduledStart(ZonedDateTime.now().minusMinutes(40))
                .scheduledEnd(scheduledEnd)
                .actualStart(actualStart)
                .build();
    }

    private void stubSaveEchoesArgument() {
        when(taskRepository.save(any(TurnaroundTask.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("rejects PENDING -> COMPLETED instead of fabricating an actualStart timestamp")
    void skippingInProgress_ShouldThrowConflict() {
        // Regression for review §2.2. The ORIGINAL code, on reaching COMPLETED with a null
        // actualStart, wrote `now.minusMinutes(15)` -- inventing an audit-relevant timestamp that
        // was never observed, in a system whose own NFR doc demands a trustworthy 7-year audit
        // trail. The state machine now makes the illegal jump impossible, so the fabrication
        // branch could be deleted outright rather than patched.
        TurnaroundTask pending = task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(10), null);
        when(taskRepository.findById(500L)).thenReturn(Optional.of(pending));

        assertThatThrownBy(() -> taskService.updateTaskStatus(500L, "COMPLETED", null, null))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("IN_PROGRESS");

        assertThat(pending.getActualStart()).as("no timestamp should have been invented").isNull();
        verify(taskRepository, never()).save(any(TurnaroundTask.class));
    }

    @Test
    @DisplayName("PENDING -> IN_PROGRESS records a real actualStart")
    void startingTask_ShouldRecordActualStart() {
        TurnaroundTask pending = task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(30), null);
        when(taskRepository.findById(500L)).thenReturn(Optional.of(pending));
        stubSaveEchoesArgument();

        TaskDTO result = taskService.updateTaskStatus(500L, "IN_PROGRESS", null, null);

        assertThat(result.getStatus()).isEqualTo("IN_PROGRESS");
        assertThat(pending.getActualStart()).isNotNull();
        assertThat(pending.getActualEnd()).isNull();
    }

    @Test
    @DisplayName("persists the notes field instead of silently discarding it")
    void notes_ShouldBePersisted() {
        // Regression for review §2.6: `notes` travelled from the request body all the way into
        // updateTaskStatus(...) and was never referenced in the method body. A crew member typing
        // "delayed due to late catering truck" got a 200 OK and their note vanished.
        TurnaroundTask inProgress = task(TaskStatus.IN_PROGRESS, ZonedDateTime.now().plusMinutes(30),
                ZonedDateTime.now().minusMinutes(10));
        when(taskRepository.findById(500L)).thenReturn(Optional.of(inProgress));
        stubSaveEchoesArgument();

        taskService.updateTaskStatus(500L, "COMPLETED", null, "Delayed due to late catering truck");

        assertThat(inProgress.getNotes()).isEqualTo("Delayed due to late catering truck");
    }

    @Test
    @DisplayName("blank notes do not overwrite an existing note")
    void blankNotes_ShouldNotClobberExistingNote() {
        TurnaroundTask inProgress = task(TaskStatus.IN_PROGRESS, ZonedDateTime.now().plusMinutes(30),
                ZonedDateTime.now().minusMinutes(10));
        inProgress.setNotes("Original observation from the ramp");
        when(taskRepository.findById(500L)).thenReturn(Optional.of(inProgress));
        stubSaveEchoesArgument();

        taskService.updateTaskStatus(500L, "COMPLETED", null, "   ");

        assertThat(inProgress.getNotes()).isEqualTo("Original observation from the ramp");
    }

    @Test
    @DisplayName("logs a DelayLog when completion runs past scheduledEnd")
    void lateCompletion_ShouldCreateDelayLog() {
        ZonedDateTime scheduledEnd = ZonedDateTime.now().minusMinutes(12); // already 12 min overdue
        TurnaroundTask late = task(TaskStatus.IN_PROGRESS, scheduledEnd, ZonedDateTime.now().minusMinutes(40));

        when(taskRepository.findById(500L)).thenReturn(Optional.of(late));
        when(flightRepository.findByIdForUpdate(101L)).thenReturn(Optional.of(flight()));
        when(delayLogRepository.findMaxSeqForFlight(101L)).thenReturn(2); // two delays already logged
        stubSaveEchoesArgument();

        taskService.updateTaskStatus(500L, "COMPLETED", null, null);

        ArgumentCaptor<DelayLog> captor = ArgumentCaptor.forClass(DelayLog.class);
        verify(delayLogRepository).save(captor.capture());
        DelayLog saved = captor.getValue();

        // Must be a code that really exists in delay_codes (seeded D01-D25): delay_logs.delay_code
        // is a FOREIGN KEY, and the old synthesized "TASK_CLE" made every late completion fail.
        assertThat(saved.getDelayCode()).isEqualTo("D05"); // CLEANING -> GROUND_HANDLING
        assertThat(saved.getDelayMinutes()).isGreaterThanOrEqualTo(12);

        // Sequence must continue from MAX(delay_seq_no)+1 read under a row lock -- NOT from
        // existingLogs.size()+1 as the original did, which was a read-then-write race that could
        // hand the same composite key to two concurrent late completions on the same flight.
        assertThat(saved.getId().getDelaySeqNo()).isEqualTo(3);
        verify(flightRepository).findByIdForUpdate(101L);
    }


    @Test
    @DisplayName("late MAINTENANCE and SECURITY tasks map to their own delay-code categories")
    void lateCompletion_ShouldMapCategoryToSeededDelayCode() {
        String[][] cases = { {"MAINTENANCE", "D06"}, {"SECURITY", "D04"}, {"REFUELING", "D05"} };
        for (String[] c : cases) {
            reset(taskRepository, flightRepository, delayLogRepository);
            TurnaroundTask late = task(TaskStatus.IN_PROGRESS, ZonedDateTime.now().minusMinutes(12),
                    ZonedDateTime.now().minusMinutes(40));
            late.setTaskName(c[0]);
            when(taskRepository.findById(500L)).thenReturn(Optional.of(late));
            when(flightRepository.findByIdForUpdate(101L)).thenReturn(Optional.of(flight()));
            when(delayLogRepository.findMaxSeqForFlight(101L)).thenReturn(0);
            stubSaveEchoesArgument();

            taskService.updateTaskStatus(500L, "COMPLETED", null, null);

            ArgumentCaptor<DelayLog> captor = ArgumentCaptor.forClass(DelayLog.class);
            verify(delayLogRepository).save(captor.capture());
            assertThat(captor.getValue().getDelayCode()).as(c[0]).isEqualTo(c[1]);
        }
    }

    @Test
    @DisplayName("no DelayLog is written when the task finishes within its SLA window")
    void onTimeCompletion_ShouldNotCreateDelayLog() {
        TurnaroundTask onTime = task(TaskStatus.IN_PROGRESS, ZonedDateTime.now().plusMinutes(15),
                ZonedDateTime.now().minusMinutes(10));
        when(taskRepository.findById(500L)).thenReturn(Optional.of(onTime));
        stubSaveEchoesArgument();

        taskService.updateTaskStatus(500L, "COMPLETED", null, null);

        assertThat(onTime.getActualEnd()).isNotNull();
        verify(delayLogRepository, never()).save(any(DelayLog.class));
        verify(flightRepository, never()).findByIdForUpdate(any());
    }

    @Test
    @DisplayName("BLOCKED is reachable from IN_PROGRESS and recoverable back to IN_PROGRESS")
    void blockedRoundTrip_ShouldBeAllowed() {
        TurnaroundTask inProgress = task(TaskStatus.IN_PROGRESS, ZonedDateTime.now().plusMinutes(30),
                ZonedDateTime.now().minusMinutes(5));
        when(taskRepository.findById(500L)).thenReturn(Optional.of(inProgress));
        stubSaveEchoesArgument();

        assertThat(taskService.updateTaskStatus(500L, "BLOCKED", null, "Awaiting spare part").getStatus())
                .isEqualTo("BLOCKED");
        assertThat(taskService.updateTaskStatus(500L, "IN_PROGRESS", null, null).getStatus())
                .isEqualTo("IN_PROGRESS");
    }

    @Test
    @DisplayName("COMPLETED is terminal -- it cannot be reopened")
    void completedIsTerminal() {
        TurnaroundTask completed = task(TaskStatus.COMPLETED, ZonedDateTime.now().minusMinutes(5),
                ZonedDateTime.now().minusMinutes(20));
        when(taskRepository.findById(500L)).thenReturn(Optional.of(completed));

        assertThatThrownBy(() -> taskService.updateTaskStatus(500L, "IN_PROGRESS", null, null))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    @DisplayName("rejects an unrecognised task status with 400")
    void unknownStatus_ShouldThrowBadRequest() {
        when(taskRepository.findById(500L)).thenReturn(Optional.of(
                task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(30), null)));

        assertThatThrownBy(() -> taskService.updateTaskStatus(500L, "DONE", null, null))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Unknown task status");
    }

    @Test
    @DisplayName("a status update naming a nonexistent user -> 404")
    void unknownUserOnStatusUpdate_ShouldThrowNotFound() {
        when(taskRepository.findById(500L)).thenReturn(Optional.of(
                task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(30), null)));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTaskStatus(500L, "IN_PROGRESS", 999L, null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    @DisplayName("assignTaskUser attaches the user to the task")
    void assignTaskUser_ShouldSucceed() {
        TurnaroundTask pending = task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(30), null);
        User crew = User.builder().userId(7L).name("R. Kulkarni").build();

        when(taskRepository.findById(500L)).thenReturn(Optional.of(pending));
        when(userRepository.findById(7L)).thenReturn(Optional.of(crew));
        stubSaveEchoesArgument();

        TaskDTO result = taskService.assignTaskUser(500L, 7L);

        assertThat(result.getAssignedUserId()).isEqualTo(7L);
        assertThat(result.getAssignedUserName()).isEqualTo("R. Kulkarni");
    }

    @Test
    @DisplayName("getTasksByFlight on an unknown flight -> 404 rather than an empty list")
    void getTasksByUnknownFlight_ShouldThrowNotFound() {
        when(flightRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.getTasksByFlight(999L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(taskRepository, never()).findByFlight_FlightId(any());
    }

    @Test
    @DisplayName("board page: blank filters become '', size is clamped, search is lower-cased")
    void taskBoardPage_normalisesFilters() {
        when(taskRepository.searchBoard(any(), any(), any()))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(java.util.List.of()));

        taskService.getTaskBoardPage(" ", "  ReFuel ", -3, 5000);

        ArgumentCaptor<org.springframework.data.domain.Pageable> pageable =
                ArgumentCaptor.forClass(org.springframework.data.domain.Pageable.class);
        verify(taskRepository).searchBoard(eq(""), eq("refuel"), pageable.capture());
        assertThat(pageable.getValue().getPageNumber()).isZero();
        assertThat(pageable.getValue().getPageSize()).isEqualTo(100);
    }

    @Test
    @DisplayName("board page: an unknown status is a 400, not an empty page")
    void taskBoardPage_rejectsUnknownStatus() {
        assertThatThrownBy(() -> taskService.getTaskBoardPage("nope", "", 0, 25))
                .isInstanceOf(BadRequestException.class);
        verifyNoInteractions(taskRepository);
    }

    @Test
    @DisplayName("status counts: every status is present even when it has no rows")
    void statusCounts_fillsMissingStatusesWithZero() {
        when(taskRepository.countByStatus()).thenReturn(java.util.List.<Object[]>of(new Object[]{"COMPLETED", 7L}));

        assertThat(taskService.getTaskStatusCounts())
                .containsEntry("COMPLETED", 7L)
                .containsEntry("PENDING", 0L)
                .containsEntry("IN_PROGRESS", 0L)
                .containsEntry("BLOCKED", 0L);
    }

    @Test
    @DisplayName("assigning work to a suspended account is refused")
    void assignTaskUser_rejectsSuspendedUser() {
        when(taskRepository.findById(500L)).thenReturn(Optional.of(task(TaskStatus.PENDING, ZonedDateTime.now().plusMinutes(10), null)));
        when(userRepository.findById(9L)).thenReturn(Optional.of(User.builder().userId(9L).status("SUSPENDED").build()));

        assertThatThrownBy(() -> taskService.assignTaskUser(500L, 9L)).isInstanceOf(ConflictException.class);
        verify(taskRepository, never()).save(any());
    }
}
