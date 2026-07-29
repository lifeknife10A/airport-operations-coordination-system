package com.saphire.aocs.service;

import com.saphire.aocs.dto.TaskCreateDTO;
import com.saphire.aocs.dto.TaskDTO;
import com.saphire.aocs.entity.DelayLog;
import com.saphire.aocs.entity.DelayLogId;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Three confirmed bugs fixed here:
 *
 *  1. NO STATE MACHINE on task status, and a symptom of that gap: when a task jumped straight
 *     from PENDING to COMPLETED (skipping IN_PROGRESS), the original code *fabricated* a fake
 *     actualStart 15 minutes in the past rather than rejecting the transition -- inventing an
 *     audit-relevant timestamp that was never actually observed. TaskStatus.canTransitionTo()
 *     now makes that jump structurally impossible, so the fabrication branch is gone entirely.
 *
 *  2. logTaskDelay()'s sequence number was computed as `existingLogs.size() + 1` with no lock --
 *     a read-then-write race. DELAY_LOGS has composite PK (flight_id, delay_seq_no); two tasks on
 *     the same flight completing late in the same instant could both compute the same nextSeq,
 *     and one insert would fail on the composite-key collision (previously an unhandled 500 --
 *     see GlobalExceptionHandler's fix for that half of it). Fixed by locking the parent Flight
 *     row for the duration of the sequence read + insert.
 *
 *  3. The `notes` parameter was accepted from the API all the way down to this method and never
 *     referenced again in the method body -- silent data loss. Now actually persisted.
 *
 * Requires two new repository methods not present in the reviewed bundle:
 *   // FlightRepository
 *   @Lock(LockModeType.PESSIMISTIC_WRITE)
 *   @Query("SELECT f FROM Flight f WHERE f.flightId = :id")
 *   Optional<Flight> findByIdForUpdate(@Param("id") Long id);
 *
 *   // DelayLogRepository
 *   @Query("SELECT COALESCE(MAX(d.id.delaySeqNo), 0) FROM DelayLog d WHERE d.flight.flightId = :flightId")
 *   int findMaxSeqForFlight(@Param("flightId") Long flightId);
 *
 * ASSUMPTION FLAGGED FOR THE TEAM: task.setNotes(...) assumes TurnaroundTask has a `notes`
 * field (it does in the entity sample in backend_data_layer_implementation_guide.md). TaskDTO
 * also had no `notes` field to round-trip it back to the caller -- add one if you want callers
 * to see what was recorded, not just write it blind.
 */
@Service
@RequiredArgsConstructor
public class TurnaroundTaskService {

    private final TaskRepository taskRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final DelayLogRepository delayLogRepository;

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByFlight(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            throw new ResourceNotFoundException("Flight not found with ID: " + flightId);
        }
        return taskRepository.findByFlight_FlightId(flightId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(TaskCreateDTO dto) {
        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + dto.getFlightId()));

        User user = null;
        if (dto.getAssignedUserId() != null) {
            user = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getAssignedUserId()));
        }

        TurnaroundTask task = TurnaroundTask.builder()
                .flight(flight)
                .taskName(dto.getTaskName())
                .status(TaskStatus.PENDING.name())
                .assignedUser(user)
                .scheduledStart(dto.getScheduledStart() != null ? dto.getScheduledStart() : ZonedDateTime.now())
                .scheduledEnd(dto.getScheduledEnd() != null ? dto.getScheduledEnd() : ZonedDateTime.now().plusMinutes(30))
                .build();

        TurnaroundTask saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long taskId, String newStatusRaw, Long userId, String notes) {
        TurnaroundTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        TaskStatus current = parseStatus(task.getStatus());
        TaskStatus target = parseStatus(newStatusRaw);

        if (!current.canTransitionTo(target)) {
            throw new ConflictException(
                    "Cannot move task " + taskId + " from " + current + " to " + target
                            + " (a task must pass through IN_PROGRESS before it can be COMPLETED)");
        }

        task.setStatus(target.name());

        // Previously accepted and silently discarded -- see fix #3 above.
        if (notes != null && !notes.isBlank()) {
            task.setNotes(notes);
        }

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
            task.setAssignedUser(user);
        }

        ZonedDateTime now = ZonedDateTime.now();

        if (target == TaskStatus.IN_PROGRESS && task.getActualStart() == null) {
            task.setActualStart(now);
        } else if (target == TaskStatus.COMPLETED) {
            // No more "if actualStart is null, invent one 15 minutes ago" -- the state-machine
            // guard above means we can no longer reach COMPLETED without having genuinely passed
            // through IN_PROGRESS, so actualStart is always a real observation by this point.
            task.setActualEnd(now);

            if (task.getScheduledEnd() != null && now.isAfter(task.getScheduledEnd())) {
                long delayMins = Duration.between(task.getScheduledEnd(), now).toMinutes();
                if (delayMins > 0) {
                    logTaskDelay(task.getFlight().getFlightId(), task.getTaskName(), (int) delayMins);
                }
            }
        }

        TurnaroundTask saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    @Transactional
    public TaskDTO assignTaskUser(Long taskId, Long userId) {
        TurnaroundTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        task.setAssignedUser(user);
        TurnaroundTask saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    /**
     * Locks the parent Flight row for the duration of the sequence read + insert, so two tasks
     * on the same flight completing late at the same instant serialize instead of racing to the
     * same delay_seq_no. See findByIdForUpdate()/findMaxSeqForFlight() in the class javadoc above
     * for the two new repository methods this needs.
     */
    private void logTaskDelay(Long flightId, String taskName, int delayMinutes) {
        Flight lockedFlight = flightRepository.findByIdForUpdate(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));

        int nextSeq = delayLogRepository.findMaxSeqForFlight(flightId) + 1;

        String codePrefix = taskName.length() >= 3 ? taskName.substring(0, 3).toUpperCase() : taskName.toUpperCase();
        DelayLog log = DelayLog.builder()
                .id(new DelayLogId(flightId, nextSeq))
                .flight(lockedFlight)
                .delayCode("TASK_" + codePrefix)
                .delayMinutes(delayMinutes)
                .build();

        delayLogRepository.save(log);
    }

    private TaskStatus parseStatus(String raw) {
        try {
            return TaskStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException(
                    "Unknown task status: '" + raw + "'. Valid values: " + Arrays.toString(TaskStatus.values()));
        }
    }

    public TaskDTO mapToDTO(TurnaroundTask task) {
        if (task == null) return null;
        return TaskDTO.builder()
                .taskId(task.getTaskId())
                .flightId(task.getFlight() != null ? task.getFlight().getFlightId() : null)
                .flightNumber(task.getFlight() != null ? task.getFlight().getFlightNumber() : null)
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getUserId() : null)
                .assignedUserName(task.getAssignedUser() != null ? task.getAssignedUser().getName() : null)
                .taskName(task.getTaskName())
                .status(task.getStatus())
                .scheduledStart(task.getScheduledStart())
                .scheduledEnd(task.getScheduledEnd())
                .actualStart(task.getActualStart())
                .actualEnd(task.getActualEnd())
                .build();
    }
}
