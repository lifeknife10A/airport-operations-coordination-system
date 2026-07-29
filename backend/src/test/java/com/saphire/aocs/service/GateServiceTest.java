package com.saphire.aocs.service;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.GateAssignmentDTO;
import com.saphire.aocs.dto.GateResponseDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.Gate;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.GateRepository;
import com.saphire.aocs.repository.StandRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Service-layer tests for GateService, covering the double-booking rule that
 * non_functional_requirements.md §3.8 requires and the original code did not implement at all.
 *
 * Written against the REFACTORED GateService.
 */
@ExtendWith(MockitoExtension.class)
class GateServiceTest {

    @Mock private GateRepository gateRepository;
    @Mock private StandRepository standRepository;
    @Mock private FlightRepository flightRepository;
    @Mock private FlightService flightService;

    @InjectMocks private GateService gateService;

    private static final ZonedDateTime BASE = ZonedDateTime.parse("2026-08-01T10:00:00+05:30");

    private Flight flight(long id, String number, ZonedDateTime arrival, ZonedDateTime departure, String status) {
        return Flight.builder()
                .flightId(id)
                .flightNumber(number)
                .flightStatus(status)
                .scheduledArrivalTime(arrival)
                .scheduledDepartureTime(departure)
                .build();
    }

    private Gate gate(long id, String number) {
        return Gate.builder().gateId(id).gateNumber(number).build();
    }

    @Test
    @DisplayName("blocks an assignment whose ground window overlaps a flight already at that gate")
    void overlappingWindow_ShouldThrowConflict() {
        // Incoming: on the ground 10:00-11:00. Existing: 10:30-11:30 at the same gate. Overlap.
        Flight incoming = flight(101L, "SPH101", BASE, BASE.plusHours(1), "SCHEDULED");
        Flight existing = flight(202L, "SPH202", BASE.plusMinutes(30), BASE.plusMinutes(90), "ON_BLOCK");
        Gate gateA1 = gate(1L, "A1");

        when(flightRepository.findById(101L)).thenReturn(Optional.of(incoming));
        when(gateRepository.findById(1L)).thenReturn(Optional.of(gateA1));
        when(flightRepository.findByGate_GateId(1L)).thenReturn(List.of(existing));

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(101L).gateId(1L).build();

        assertThatThrownBy(() -> gateService.assignGateToFlight(dto))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("A1")
                .hasMessageContaining("SPH202");

        // The original had no check at all and would have committed this double-booking silently.
        verify(flightRepository, never()).save(any(Flight.class));
    }

    @Test
    @DisplayName("allows an assignment that is adjacent but non-overlapping")
    void nonOverlappingWindow_ShouldSucceed() {
        // Incoming 10:00-11:00, existing 11:00-12:00. Touching endpoints only -> not an overlap
        // under half-open interval semantics, which is the correct call for gate turnover.
        Flight incoming = flight(101L, "SPH101", BASE, BASE.plusHours(1), "SCHEDULED");
        Flight existing = flight(202L, "SPH202", BASE.plusHours(1), BASE.plusHours(2), "SCHEDULED");
        Gate gateA1 = gate(1L, "A1");

        when(flightRepository.findById(101L)).thenReturn(Optional.of(incoming));
        when(gateRepository.findById(1L)).thenReturn(Optional.of(gateA1));
        when(flightRepository.findByGate_GateId(1L)).thenReturn(List.of(existing));
        when(flightRepository.save(any(Flight.class))).thenAnswer(inv -> inv.getArgument(0));
        when(flightService.mapToDTO(any(Flight.class)))
                .thenReturn(FlightDTO.builder().flightId(101L).gateId(1L).gateNumber("A1").build());

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(101L).gateId(1L).build();
        FlightDTO result = gateService.assignGateToFlight(dto);

        assertThat(result.getGateNumber()).isEqualTo("A1");
        assertThat(incoming.getGate()).isEqualTo(gateA1);
    }

    @Test
    @DisplayName("a DEPARTED flight at the gate is not treated as a conflict")
    void departedFlightAtGate_ShouldNotBlock() {
        // A flight that has already pushed back no longer occupies the gate, even though its row
        // still carries gate_id. Without the status filter this would be a false-positive clash.
        Flight incoming = flight(101L, "SPH101", BASE, BASE.plusHours(1), "SCHEDULED");
        Flight departed = flight(202L, "SPH202", BASE, BASE.plusHours(1), "DEPARTED");

        when(flightRepository.findById(101L)).thenReturn(Optional.of(incoming));
        when(gateRepository.findById(1L)).thenReturn(Optional.of(gate(1L, "A1")));
        when(flightRepository.findByGate_GateId(1L)).thenReturn(List.of(departed));
        when(flightRepository.save(any(Flight.class))).thenAnswer(inv -> inv.getArgument(0));
        when(flightService.mapToDTO(any(Flight.class))).thenReturn(FlightDTO.builder().flightId(101L).build());

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(101L).gateId(1L).build();

        assertThat(gateService.assignGateToFlight(dto)).isNotNull();
    }

    @Test
    @DisplayName("re-confirming the same flight at the same gate is not a self-conflict")
    void sameFlightReassignedToSameGate_ShouldNotSelfConflict() {
        // Exercises the !f.getFlightId().equals(incoming.getFlightId()) exclusion: without it, a
        // simple idempotent re-confirmation would report the flight as clashing with itself.
        Flight incoming = flight(101L, "SPH101", BASE, BASE.plusHours(1), "ON_BLOCK");

        when(flightRepository.findById(101L)).thenReturn(Optional.of(incoming));
        when(gateRepository.findById(1L)).thenReturn(Optional.of(gate(1L, "A1")));
        when(flightRepository.findByGate_GateId(1L)).thenReturn(List.of(incoming));
        when(flightRepository.save(any(Flight.class))).thenAnswer(inv -> inv.getArgument(0));
        when(flightService.mapToDTO(any(Flight.class))).thenReturn(FlightDTO.builder().flightId(101L).build());

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(101L).gateId(1L).build();

        assertThat(gateService.assignGateToFlight(dto)).isNotNull();
    }

    @Test
    @DisplayName("unknown gate id -> 404")
    void unknownGate_ShouldThrowNotFound() {
        when(flightRepository.findById(101L)).thenReturn(Optional.of(flight(101L, "SPH101", BASE, BASE.plusHours(1), "SCHEDULED")));
        when(gateRepository.findById(99L)).thenReturn(Optional.empty());

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(101L).gateId(99L).build();

        assertThatThrownBy(() -> gateService.assignGateToFlight(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Gate");
    }

    @Test
    @DisplayName("unknown flight id -> 404")
    void unknownFlight_ShouldThrowNotFound() {
        when(flightRepository.findById(999L)).thenReturn(Optional.empty());

        GateAssignmentDTO dto = GateAssignmentDTO.builder().flightId(999L).gateId(1L).build();

        assertThatThrownBy(() -> gateService.assignGateToFlight(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Flight");
    }

    @Test
    @DisplayName("getAllGates excludes historic DEPARTED flights from activeFlights")
    void getAllGates_ShouldExcludeTerminalFlightsFromActiveList() {
        // Regression for review §2.4: the original populated activeFlights from every flight ever
        // assigned to the gate, so a flight that departed weeks ago stayed listed as "active"
        // forever. The field name promised "active"; the code delivered "all history".
        Gate gateA1 = gate(1L, "A1");
        Flight departed = flight(202L, "SPH202", BASE, BASE.plusHours(1), "DEPARTED");
        departed.setGate(gateA1);

        when(gateRepository.findAll()).thenReturn(List.of(gateA1));
        when(flightRepository.findAllSaphireHubFlightsWithAllDetails()).thenReturn(List.of(departed));
        when(standRepository.findAll()).thenReturn(List.of());

        List<GateResponseDTO> result = gateService.getAllGates();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getActiveFlights()).isEmpty();
        verify(flightService, never()).mapToDTO(any(Flight.class));
    }
}
