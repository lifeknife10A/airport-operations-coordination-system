package com.saphire.aocs.service;

import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.PagedResponseDTO;
import com.saphire.aocs.entity.*;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
@Slf4j
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
    private final com.saphire.aocs.repository.RunwayRepository runwayRepository;
    private final com.saphire.aocs.repository.TaskRepository taskRepository;

    private static final int MAX_PAGE_SIZE = 100;

    @Transactional(readOnly = true)
    public List<FlightDTO> getSaphireHubFlights() {
        return flightRepository.findAllSaphireHubFlightsWithAllDetails().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Real SQL-level pagination (LIMIT/OFFSET) -- unlike getSaphireHubFlights() above, this never
     * loads more than `size` rows into memory regardless of how many flights exist in total.
     * page is clamped to >= 0 and size to [1, MAX_PAGE_SIZE] so a bad/malicious query param can't
     * force an unbounded fetch.
     */
    @Transactional(readOnly = true)
    public PagedResponseDTO<FlightDTO> getSaphireHubFlightsPaged(int page, int size) {
        return getSaphireHubFlightsPaged(page, size, null);
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<FlightDTO> getSaphireHubFlightsPaged(int page, int size, String query) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "flightId"));

        String trimmedQuery = query == null ? null : query.trim();
        Page<Flight> result = (trimmedQuery == null || trimmedQuery.isEmpty())
                ? flightRepository.findAllSaphireHubFlightsWithAllDetails(pageable)
                : flightRepository.searchSaphireHubFlights(trimmedQuery, pageable);

        return PagedResponseDTO.<FlightDTO>builder()
                .content(withTaskCounts(result.getContent().stream().map(this::mapToDTO).collect(Collectors.toList())))
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    /** Fills tasksTotal/tasksCompleted for a whole page of flights with a single grouped query. */
    private List<FlightDTO> withTaskCounts(List<FlightDTO> flights) {
        if (flights.isEmpty()) return flights;
        java.util.Map<Long, int[]> counts = new java.util.HashMap<>();
        for (Object[] row : taskRepository.countTasksByFlightIds(
                flights.stream().map(FlightDTO::getFlightId).collect(Collectors.toList()))) {
            counts.put((Long) row[0], new int[]{((Number) row[1]).intValue(), ((Number) row[2]).intValue()});
        }
        for (FlightDTO f : flights) {
            int[] c = counts.getOrDefault(f.getFlightId(), new int[2]);
            f.setTasksTotal(c[0]);
            f.setTasksCompleted(c[1]);
        }
        return flights;
    }

    /** Flights that are live or upcoming: boarding first, then delayed, then scheduled. */
    @Transactional(readOnly = true)
    public List<FlightDTO> getOperationalFlights(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, MAX_PAGE_SIZE));
        return withTaskCounts(flightRepository.findOperationalFlights(PageRequest.of(0, safeLimit)).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
    }

    /** Hub flight count per status; every known status is present even at zero. */
    @Transactional(readOnly = true)
    public java.util.Map<String, Long> getFlightStatusSummary() {
        java.util.Map<String, Long> counts = new java.util.LinkedHashMap<>();
        for (FlightStatus s : FlightStatus.values()) counts.put(s.name(), 0L);
        for (Object[] row : flightRepository.countHubFlightsByStatus()) counts.put(String.valueOf(row[0]), (Long) row[1]);
        return counts;
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

    /** Assigns the departure/arrival runway. Closed runways (sweep or maintenance) cannot be assigned. */
    @Transactional
    public FlightDTO assignRunway(Long flightId, Long runwayId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));
        com.saphire.aocs.entity.Runway runway = runwayRepository.findById(runwayId)
                .orElseThrow(() -> new ResourceNotFoundException("Runway not found with ID: " + runwayId));
        String status = runway.getOperationalStatus();
        if ("SWEEP_FOD_INSPECTION".equals(status) || "CLOSED_MAINTENANCE".equals(status)) {
            throw new ConflictException("Runway " + runway.getRunwayCode() + " is closed (" + status + ") and cannot take traffic");
        }
        flight.setRunwayId(runway.getRunwayId());
        log.info("Runway {} assigned to flight {} (id {})", runway.getRunwayCode(), flight.getFlightNumber(), flightId);
        return mapToDTO(flightRepository.save(flight));
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

        log.info("Flight {} (id {}) status {} -> {}", flight.getFlightNumber(), flightId, current, target);
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
                .aircraftType(flight.getAircraft() != null && flight.getAircraft().getAircraftType() != null
                        ? flight.getAircraft().getAircraftType().getModelName() : null)
                .aircraftWingspanMeters(flight.getAircraft() != null && flight.getAircraft().getAircraftType() != null
                        && flight.getAircraft().getAircraftType().getWingspanMeters() != null
                        ? flight.getAircraft().getAircraftType().getWingspanMeters().doubleValue() : null)
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
