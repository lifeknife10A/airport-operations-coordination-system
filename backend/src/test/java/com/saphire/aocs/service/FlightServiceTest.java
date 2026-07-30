package com.saphire.aocs.service;

import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.entity.Airport;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.FlightStatus;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
 * Service-layer tests for FlightService. NONE of this class was covered by any test in the
 * reviewed bundle -- the only Flight tests were controller tests that mocked FlightService
 * entirely, so every business rule in it (the Saphire hub constraint, status transitions,
 * timestamp handling) was completely unexercised.
 *
 * Written against the REFACTORED FlightService. Several of these tests will not compile or will
 * fail against the original -- that is deliberate: they exist to pin the fixed behaviour.
 *
 * ENTITY ASSUMPTION: uses Flight.builder() / Airport.builder() with the field names visible in
 * backend_data_layer_implementation_guide.md. Adjust if your live entity differs.
 */
@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock private FlightRepository flightRepository;
    @Mock private AirportRepository airportRepository;
    @Mock private AirlineRepository airlineRepository;
    @Mock private AircraftRepository aircraftRepository;
    @Mock private GateRepository gateRepository;
    @Mock private StandRepository standRepository;
    @Mock private DepartmentRepository departmentRepository;

    @InjectMocks private FlightService flightService;

    private Flight flightWithStatus(FlightStatus status) {
        return Flight.builder()
                .flightId(101L)
                .flightNumber("SPH101")
                .flightStatus(status.name())
                .flightType("ARRIVAL")
                .build();
    }

    /** Makes save() behave like a real repository: return what was handed to it. */
    private void stubSaveEchoesArgument() {
        when(flightRepository.save(any(Flight.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Nested
    @DisplayName("updateFlightStatus - state machine guard")
    class StateMachine {

        @Test
        @DisplayName("rejects SCHEDULED -> DEPARTED as an illegal state jump")
        void illegalJump_ShouldThrowConflict() {
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.SCHEDULED)));

            assertThatThrownBy(() -> flightService.updateFlightStatus(101L, "DEPARTED"))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("SCHEDULED")
                    .hasMessageContaining("DEPARTED");

            // The critical assertion: nothing was persisted. The original implementation would
            // have written the illegal status straight through to the database here.
            verify(flightRepository, never()).save(any(Flight.class));
        }

        @Test
        @DisplayName("allows the legal SERVICING -> READY step")
        void legalTransition_ShouldSucceed() {
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.SERVICING)));
            stubSaveEchoesArgument();

            FlightDTO result = flightService.updateFlightStatus(101L, "READY");

            assertThat(result.getFlightStatus()).isEqualTo("READY");
            verify(flightRepository).save(any(Flight.class));
        }

        @Test
        @DisplayName("accepts lower-case input (status parsing is case-insensitive)")
        void lowerCaseStatus_ShouldBeAccepted() {
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.LANDED)));
            stubSaveEchoesArgument();

            FlightDTO result = flightService.updateFlightStatus(101L, "on_block");

            assertThat(result.getFlightStatus()).isEqualTo("ON_BLOCK");
        }

        @Test
        @DisplayName("rejects an unknown/typo'd status with 400 rather than storing it")
        void unknownStatus_ShouldThrowBadRequest() {
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.SCHEDULED)));

            // The original would have upper-cased "DEPARTEDD" and persisted it verbatim, deferring
            // the failure to a DB CHECK constraint -- which then surfaced as an unhandled 500.
            assertThatThrownBy(() -> flightService.updateFlightStatus(101L, "DEPARTEDD"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Unknown flight status");

            verify(flightRepository, never()).save(any(Flight.class));
        }

        @Test
        @DisplayName("CANCELLED is reachable from an in-progress state but not from DEPARTED")
        void cancellationRules() {
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.BOARDING)));
            stubSaveEchoesArgument();

            assertThat(flightService.updateFlightStatus(101L, "CANCELLED").getFlightStatus())
                    .isEqualTo("CANCELLED");

            reset(flightRepository);
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flightWithStatus(FlightStatus.DEPARTED)));

            assertThatThrownBy(() -> flightService.updateFlightStatus(101L, "CANCELLED"))
                    .isInstanceOf(ConflictException.class);
        }

        @Test
        @DisplayName("unknown flight id -> 404")
        void unknownFlight_ShouldThrowNotFound() {
            when(flightRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> flightService.updateFlightStatus(999L, "LANDED"))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("updateFlightStatus - timestamp idempotency (regression for review §2.2)")
    class TimestampIdempotency {

        @Test
        @DisplayName("a duplicate LANDED submission cannot overwrite actualArrivalTime")
        void duplicateLanded_ShouldNotOverwriteArrivalTime() {
            Flight flight = flightWithStatus(FlightStatus.SCHEDULED);
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flight));
            stubSaveEchoesArgument();

            flightService.updateFlightStatus(101L, "LANDED");
            ZonedDateTime firstArrival = flight.getActualArrivalTime();
            assertThat(firstArrival).isNotNull();

            // Second identical submission (a retried request, or a double-tap on a ramp tablet).
            // In the refactor this is rejected by the transition guard -- LANDED -> LANDED is not
            // a legal edge -- so the recorded timestamp survives. The ORIGINAL code had no guard
            // AND no null-check on this branch, so it silently rewrote actualArrivalTime to the
            // later instant, corrupting the field that actual_turnaround_minutes is derived from.
            assertThatThrownBy(() -> flightService.updateFlightStatus(101L, "LANDED"))
                    .isInstanceOf(ConflictException.class);

            assertThat(flight.getActualArrivalTime()).isEqualTo(firstArrival);
        }

        @Test
        @DisplayName("AIRBORNE then DEPARTED both touch actualDepartureTime, but only the first sets it")
        void airborneThenDeparted_ShouldSetDepartureTimeOnce() {
            // This is the sharper test of the null-guard itself: unlike the case above, BOTH of
            // these transitions are perfectly legal AND both hit the same actualDepartureTime
            // branch, so the state machine alone cannot protect the timestamp here -- the
            // null-guard has to. The original code had neither, and would overwrite.
            Flight flight = flightWithStatus(FlightStatus.BOARDING);
            when(flightRepository.findById(101L)).thenReturn(Optional.of(flight));
            stubSaveEchoesArgument();

            flightService.updateFlightStatus(101L, "AIRBORNE");
            ZonedDateTime firstDeparture = flight.getActualDepartureTime();
            assertThat(firstDeparture).isNotNull();

            flightService.updateFlightStatus(101L, "DEPARTED");

            assertThat(flight.getFlightStatus()).isEqualTo("DEPARTED");
            assertThat(flight.getActualDepartureTime())
                    .as("actualDepartureTime must retain the AIRBORNE instant, not be rewritten by DEPARTED")
                    .isEqualTo(firstDeparture);
        }
    }

    @Nested
    @DisplayName("createFlight - Saphire hub constraint and FK resolution")
    class CreateFlight {

        private FlightCreateDTO.FlightCreateDTOBuilder validDtoBuilder() {
            return FlightCreateDTO.builder()
                    .flightNumber("SPH101")
                    .flightStatus("SCHEDULED")
                    .flightType("ARRIVAL")
                    .originAirportId(2L)          // DXB
                    .destinationAirportId(1L)     // SPH -- satisfies the hub constraint
                    .airlineId(3L)
                    .aircraftId(4L)
                    .scheduledDepartureTime(ZonedDateTime.now())
                    .scheduledArrivalTime(ZonedDateTime.now().plusHours(3));
        }

        @Test
        @DisplayName("rejects a flight that neither departs from nor arrives at SPH")
        void nonSaphireRoute_ShouldThrowBadRequest() {
            // BOM -> DEL: a third-party route Saphire's ground teams have no involvement in.
            // See saphire_hub_architecture.md §2 for the operational rule this enforces.
            FlightCreateDTO dto = validDtoBuilder()
                    .originAirportId(2L)
                    .destinationAirportId(3L)
                    .build();

            assertThatThrownBy(() -> flightService.createFlight(dto))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Saphire");

            verify(flightRepository, never()).save(any(Flight.class));
        }

        @Test
        @DisplayName("a supplied-but-nonexistent gateId now 404s instead of being silently dropped")
        void badOptionalForeignKey_ShouldThrowNotFound() {
            when(airportRepository.findById(2L)).thenReturn(Optional.of(Airport.builder().airportId(2L).iataCode("DXB").build()));
            when(airportRepository.findById(1L)).thenReturn(Optional.of(Airport.builder().airportId(1L).iataCode("SPH").build()));
            when(airlineRepository.findById(3L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Airline.class)));
            when(aircraftRepository.findById(4L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Aircraft.class)));
            when(gateRepository.findById(77L)).thenReturn(Optional.empty());

            FlightCreateDTO dto = validDtoBuilder().gateId(77L).build();

            // The ORIGINAL used .orElse(null) here, so this returned 201 Created with gate quietly
            // left null -- while originAirportId/airlineId/aircraftId three lines above were
            // correctly held to a 404-on-bad-id standard. Now all seven FKs behave consistently.
            assertThatThrownBy(() -> flightService.createFlight(dto))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Gate");

            verify(flightRepository, never()).save(any(Flight.class));
        }

        @Test
        @DisplayName("an omitted gateId is still allowed (the association is genuinely optional)")
        void omittedOptionalForeignKey_ShouldSucceed() {
            when(airportRepository.findById(2L)).thenReturn(Optional.of(Airport.builder().airportId(2L).iataCode("DXB").build()));
            when(airportRepository.findById(1L)).thenReturn(Optional.of(Airport.builder().airportId(1L).iataCode("SPH").build()));
            when(airlineRepository.findById(3L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Airline.class)));
            when(aircraftRepository.findById(4L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Aircraft.class)));
            stubSaveEchoesArgument();

            FlightDTO result = flightService.createFlight(validDtoBuilder().gateId(null).build());

            assertThat(result).isNotNull();
            assertThat(result.getGateId()).isNull();
        }

        @Test
        @DisplayName("defaults to SCHEDULED when no status is supplied")
        void missingStatus_ShouldDefaultToScheduled() {
            when(airportRepository.findById(2L)).thenReturn(Optional.of(Airport.builder().airportId(2L).iataCode("DXB").build()));
            when(airportRepository.findById(1L)).thenReturn(Optional.of(Airport.builder().airportId(1L).iataCode("SPH").build()));
            when(airlineRepository.findById(3L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Airline.class)));
            when(aircraftRepository.findById(4L)).thenReturn(Optional.of(mock(com.saphire.aocs.entity.Aircraft.class)));
            stubSaveEchoesArgument();

            FlightDTO result = flightService.createFlight(validDtoBuilder().flightStatus(null).build());

            assertThat(result.getFlightStatus()).isEqualTo("SCHEDULED");
        }
    }
}
