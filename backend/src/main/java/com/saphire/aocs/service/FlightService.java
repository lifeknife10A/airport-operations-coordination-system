package com.saphire.aocs.service;

import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.entity.*;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.time.ZonedDateTime;

/**
 * Two confirmed bugs fixed here, both in updateFlightStatus():
 *
 *  1. NO STATE MACHINE. The original accepted any string, upper-cased it, and stored it — a
 *     flight could go SCHEDULED -> DEPARTED directly, or receive a typo'd status that would
 *     only fail later at the DB CHECK-constraint layer (as an unhandled 500 — see
 *     GlobalExceptionHandler's fix). Now guarded by FlightStatus.canTransitionTo(), which
 *     rejects illegal jumps with 409 Conflict instead of silently accepting them.
 *
 *  2. NON-IDEMPOTENT TIMESTAMP WRITES. actualArrivalTime/actualDepartureTime were overwritten
 *     unconditionally on every call (unlike boardingTime, which the original code correctly
 *     null-guarded) — calling the same status update twice, or hitting AIRBORNE and later
 *     DEPARTED, silently corrupted the timestamps your entire analytics star schema computes
 *     actual_turnaround_minutes from. All three are now null-guarded consistently.
 *
 * Also fixes createFlight()'s silent `.orElse(null)` on gateId/standId/departmentId, which
 * let a caller supply a non-existent id and get a 201 with that association quietly left null,
 * while originAirportId/airlineId/aircraftId three lines above were (correctly) held to a
 * stricter 404-on-bad-id standard. resolveOptional() below applies that same stricter standard
 * consistently: null id -> null association (fine, it's optional), non-null id that doesn't
 * resolve -> 404 (previously: silently ignored).
 */
@Service
@RequiredArgsConstructor
public class FlightService {

    private static final long SAPHIRE_AIRPORT_ID = 1L;

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final AirlineRepository airlineRepository;
    private final AircraftRepository aircraftRepository;
    private final GateRepository gateRepository;
    private final StandRepository standRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<FlightDTO> getSaphireHubFlights() {
        return flightRepository.findAllSaphireHubFlightsWithAllDetails().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FlightDTO getFlightById(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));
        return mapToDTO(flight);
    }

    @Transactional
    public FlightDTO createFlight(FlightCreateDTO dto) {
        if (dto.getOriginAirportId() != SAPHIRE_AIRPORT_ID && dto.getDestinationAirportId() != SAPHIRE_AIRPORT_ID) {
            throw new BadRequestException(
                    "Flight must originate or terminate at Saphire International Airport (airport_id = " + SAPHIRE_AIRPORT_ID + ")");
        }

        Airport origin = airportRepository.findById(dto.getOriginAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found: " + dto.getOriginAirportId()));
        Airport destination = airportRepository.findById(dto.getDestinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found: " + dto.getDestinationAirportId()));
        Airline airline = airlineRepository.findById(dto.getAirlineId())
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found: " + dto.getAirlineId()));
        Aircraft aircraft = aircraftRepository.findById(dto.getAircraftId())
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft not found: " + dto.getAircraftId()));

        // Previously .orElse(null) -- a bad id was silently swallowed instead of 404ing like the
        // four lookups above it. resolveOptional() still allows an *omitted* id (null in, null
        // out) but now 404s on a *supplied* id that doesn't resolve.
        Gate gate = resolveOptional(dto.getGateId(), gateRepository::findById, "Gate");
        Stand stand = resolveOptional(dto.getStandId(), standRepository::findById, "Stand");
        Department dept = resolveOptional(dto.getDepartmentId(), departmentRepository::findById, "Department");

        FlightStatus initialStatus = dto.getFlightStatus() != null
                ? parseStatus(dto.getFlightStatus())
                : FlightStatus.SCHEDULED;

        Flight flight = Flight.builder()
                .flightNumber(dto.getFlightNumber())
                .flightStatus(initialStatus.name())
                .flightType(dto.getFlightType())
                .originAirport(origin)
                .destinationAirport(destination)
                .airline(airline)
                .aircraft(aircraft)
                .gate(gate)
                .stand(stand)
                .scheduledDepartureTime(dto.getScheduledDepartureTime())
                .scheduledArrivalTime(dto.getScheduledArrivalTime())
                .estimatedDepartureTime(dto.getEstimatedDepartureTime())
                .estimatedArrivalTime(dto.getEstimatedArrivalTime())
                .boardingTime(dto.getBoardingTime())
                .runwayId(dto.getRunwayId())
                .department(dept)
                .inboundFlightId(dto.getInboundFlightId())
                .build();

        Flight saved = flightRepository.save(flight);
        return mapToDTO(saved);
    }

    @Transactional
    public FlightDTO updateFlightStatus(Long flightId, String newStatusRaw) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));

        FlightStatus current = parseStatus(flight.getFlightStatus());
        FlightStatus target = parseStatus(newStatusRaw);

        if (!current.canTransitionTo(target)) {
            throw new ConflictException(
                    "Cannot transition flight " + flight.getFlightNumber() + " (id=" + flightId + ") from "
                            + current + " to " + target);
        }

        flight.setFlightStatus(target.name());
        ZonedDateTime now = ZonedDateTime.now();

        // All three branches are now null-guarded (the original only guarded BOARDING) so a
        // repeated or out-of-order call can never clobber a timestamp that was already recorded.
        switch (target) {
            case LANDED -> {
                if (flight.getActualArrivalTime() == null) flight.setActualArrivalTime(now);
            }
            case AIRBORNE, DEPARTED -> {
                if (flight.getActualDepartureTime() == null) flight.setActualDepartureTime(now);
            }
            case BOARDING -> {
                if (flight.getBoardingTime() == null) flight.setBoardingTime(now);
            }
            default -> {
                // SCHEDULED / ON_BLOCK / SERVICING / READY / CANCELLED have no timestamp side-effect.
            }
        }

        // TODO(audit): non_functional_requirements.md §6 requires every status change to write an
        // immutable audit entry (user_id, action, old/new value, timestamp). Not wired here because
        // AuditLog's entity shape wasn't included in the reviewed bundle -- once it's available:
        //   auditLogRepository.save(AuditLog.builder()
        //       .action("FLIGHT_STATUS_CHANGE")
        //       .userId(currentUserIdFromSecurityContext())
        //       .build());

        Flight saved = flightRepository.save(flight);
        return mapToDTO(saved);
    }

    private FlightStatus parseStatus(String raw) {
        try {
            return FlightStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException(
                    "Unknown flight status: '" + raw + "'. Valid values: " + Arrays.toString(FlightStatus.values()));
        }
    }

    /** null id -> null (association is genuinely optional); non-null id that doesn't resolve -> 404. */
    private <T> T resolveOptional(Long id, Function<Long, Optional<T>> finder, String label) {
        if (id == null) {
            return null;
        }
        return finder.apply(id).orElseThrow(() -> new ResourceNotFoundException(label + " not found with ID: " + id));
    }

    public FlightDTO mapToDTO(Flight flight) {
        if (flight == null) return null;
        return FlightDTO.builder()
                .flightId(flight.getFlightId())
                .flightNumber(flight.getFlightNumber())
                .flightStatus(flight.getFlightStatus())
                .flightType(flight.getFlightType())
                .originAirportId(flight.getOriginAirport() != null ? flight.getOriginAirport().getAirportId() : null)
                .originAirportCode(flight.getOriginAirport() != null ? flight.getOriginAirport().getIataCode() : null)
                .originAirportName(flight.getOriginAirport() != null ? flight.getOriginAirport().getAirportName() : null)
                .destinationAirportId(flight.getDestinationAirport() != null ? flight.getDestinationAirport().getAirportId() : null)
                .destinationAirportCode(flight.getDestinationAirport() != null ? flight.getDestinationAirport().getIataCode() : null)
                .destinationAirportName(flight.getDestinationAirport() != null ? flight.getDestinationAirport().getAirportName() : null)
                .airlineId(flight.getAirline() != null ? flight.getAirline().getAirlineId() : null)
                .airlineCode(flight.getAirline() != null ? flight.getAirline().getIataCode() : null)
                .airlineName(flight.getAirline() != null ? flight.getAirline().getAirlineName() : null)
                .aircraftId(flight.getAircraft() != null ? flight.getAircraft().getAircraftId() : null)
                .aircraftRegistration(flight.getAircraft() != null ? flight.getAircraft().getRegistrationNumber() : null)
                .gateId(flight.getGate() != null ? flight.getGate().getGateId() : null)
                .gateNumber(flight.getGate() != null ? flight.getGate().getGateNumber() : null)
                .standId(flight.getStand() != null ? flight.getStand().getStandId() : null)
                .standNumber(flight.getStand() != null ? flight.getStand().getStandNumber() : null)
                .scheduledDepartureTime(flight.getScheduledDepartureTime())
                .estimatedDepartureTime(flight.getEstimatedDepartureTime())
                .actualDepartureTime(flight.getActualDepartureTime())
                .scheduledArrivalTime(flight.getScheduledArrivalTime())
                .estimatedArrivalTime(flight.getEstimatedArrivalTime())
                .actualArrivalTime(flight.getActualArrivalTime())
                .boardingTime(flight.getBoardingTime())
                .runwayId(flight.getRunwayId())
                .departmentId(flight.getDepartment() != null ? flight.getDepartment().getDepartmentId() : null)
                .departmentName(flight.getDepartment() != null ? flight.getDepartment().getDepartmentName() : null)
                .inboundFlightId(flight.getInboundFlightId())
                .build();
    }
}
