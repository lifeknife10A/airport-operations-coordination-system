package com.saphire.aocs.service;

import com.saphire.aocs.dto.DelayCreateDTO;
import com.saphire.aocs.entity.DelayLog;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DelayLogRepository;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.TaskRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightOperationsServiceTest {

    @Mock private JdbcTemplate jdbc;
    @Mock private FlightRepository flightRepository;
    @Mock private TaskRepository taskRepository;
    @Mock private DelayLogRepository delayLogRepository;
    @Mock private FlightService flightService;
    @Mock private TurnaroundTaskService turnaroundTaskService;

    @InjectMocks private FlightOperationsService service;

    private static final ZonedDateTime DEPARTURE = ZonedDateTime.parse("2026-08-01T10:00:00+05:30");

    private Flight flight(String status) {
        return Flight.builder().flightId(7L).flightNumber("SPH7").flightStatus(status)
                .scheduledDepartureTime(DEPARTURE).build();
    }

    @Test
    @DisplayName("an unknown delay code is a 400 and nothing is written")
    void unknownDelayCode_isRejected() {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq("ZZZ"))).thenReturn(0);

        assertThatThrownBy(() -> service.logDelay(7L, new DelayCreateDTO("zzz", 10))).isInstanceOf(BadRequestException.class);
        verify(delayLogRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("an unknown flight is a 404")
    void unknownFlight_is404() {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq("D02"))).thenReturn(1);
        when(flightRepository.findByIdForUpdate(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.logDelay(7L, new DelayCreateDTO("D02", 10))).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("logging a delay numbers it, pushes the estimate back and marks a scheduled flight DELAYED")
    @SuppressWarnings("unchecked")
    void logDelay_updatesFlight() {
        Flight f = flight("SCHEDULED");
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq("D02"))).thenReturn(1);
        when(flightRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(f));
        when(delayLogRepository.findMaxSeqForFlight(7L)).thenReturn(3);
        when(jdbc.query(anyString(), any(org.springframework.jdbc.core.RowMapper.class), any(Object[].class)))
                .thenReturn(List.of(com.saphire.aocs.dto.DelayEntryDTO.builder().seqNo(4).build()));

        service.logDelay(7L, new DelayCreateDTO("d02", 25));

        ArgumentCaptor<DelayLog> saved = ArgumentCaptor.forClass(DelayLog.class);
        verify(delayLogRepository).saveAndFlush(saved.capture());
        assertThat(saved.getValue().getId().getDelaySeqNo()).isEqualTo(4);
        assertThat(saved.getValue().getDelayCode()).isEqualTo("D02");
        assertThat(f.getEstimatedDepartureTime()).isEqualTo(DEPARTURE.plusMinutes(25));
        assertThat(f.getFlightStatus()).isEqualTo("DELAYED");
    }

    @Test
    @DisplayName("a flight that cannot move to DELAYED keeps its status but the delay is still logged")
    @SuppressWarnings("unchecked")
    void logDelay_leavesStatusWhenTransitionNotAllowed() {
        Flight f = flight("DEPARTED");
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq("D02"))).thenReturn(1);
        when(flightRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(f));
        when(delayLogRepository.findMaxSeqForFlight(7L)).thenReturn(0);
        when(jdbc.query(anyString(), any(org.springframework.jdbc.core.RowMapper.class), any(Object[].class)))
                .thenReturn(List.of(com.saphire.aocs.dto.DelayEntryDTO.builder().seqNo(1).build()));

        service.logDelay(7L, new DelayCreateDTO("D02", 5));

        assertThat(f.getFlightStatus()).isEqualTo("DEPARTED");
        verify(delayLogRepository).saveAndFlush(any(DelayLog.class));
    }
}
