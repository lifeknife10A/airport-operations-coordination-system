package com.saphire.aocs.service;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.GateAssignmentDTO;
import com.saphire.aocs.dto.GateResponseDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.Gate;
import com.saphire.aocs.entity.Stand;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.GateRepository;
import com.saphire.aocs.repository.StandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GateService {

    /** Flight statuses that no longer occupy physical gate/stand real estate. */
    private static final Set<String> INACTIVE_STATUSES = Set.of("DEPARTED", "CANCELLED");

    private final GateRepository gateRepository;
    private final StandRepository standRepository;
    private final FlightRepository flightRepository;
    private final FlightService flightService;

    @Transactional(readOnly = true)
    public List<GateResponseDTO> getAllGates() {
        List<Gate> gates = gateRepository.findAll();
        List<Flight> liveFlights = flightRepository.findOperationalFlights(org.springframework.data.domain.PageRequest.of(0, 100)).stream()
                .filter(f -> !INACTIVE_STATUSES.contains(f.getFlightStatus()))
                .collect(Collectors.toList());
        List<Stand> allStands = standRepository.findAll();

        return gates.stream().map(gate -> {
            List<GateResponseDTO.StandInfo> standsForGate = allStands.stream()
                    .filter(s -> s.getAssignedGate() != null && s.getAssignedGate().getGateId().equals(gate.getGateId()))
                    .map(s -> new GateResponseDTO.StandInfo(s.getStandId(), s.getStandNumber(), s.getIsRemote(), s.getHasJetbridge()))
                    .collect(Collectors.toList());

            List<FlightDTO> activeFlights = liveFlights.stream()
                    .filter(f -> f.getGate() != null && f.getGate().getGateId().equals(gate.getGateId()))
                    .map(flightService::mapToDTO)
                    .collect(Collectors.toList());

            String concourse = gate.getConcourse();
            if (concourse == null && gate.getGateNumber() != null) {
                if (gate.getGateNumber().startsWith("A")) concourse = "Concourse A";
                else if (gate.getGateNumber().startsWith("B")) concourse = "Concourse B";
                else if (gate.getGateNumber().startsWith("C")) concourse = "Concourse C";
                else concourse = "Concourse A";
            }
            String terminal = gate.getTerminal() != null ? gate.getTerminal() : "Central Terminal";

            return GateResponseDTO.builder()
                    .gateId(gate.getGateId())
                    .gateNumber(gate.getGateNumber())
                    .concourse(concourse)
                    .terminal(terminal)
                    .maxWingspanMeters(gate.getMaxWingspanMeters())
                    .stands(standsForGate)
                    .activeFlights(activeFlights)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Check-then-write on gate/stand occupancy, so it has to be serialized: two concurrent requests
     * for the same gate used to both read "no conflict" before either committed, and both saved --
     * a double-booked gate (reproduced 30 of 30 times with paired parallel requests).
     *
     * Rows are locked with SELECT ... FOR UPDATE before the overlap query runs, always in the order
     * gate -> stand -> flight. The second request blocks on the gate lock until the first commits,
     * then its overlap query (a fresh statement under READ COMMITTED) sees the first booking and
     * gets a 409. A fixed lock order means two requests can never wait on each other in a cycle.
     */
    @Transactional
    public FlightDTO assignGateToFlight(GateAssignmentDTO dto) {
        Gate gate = gateRepository.findByIdForUpdate(dto.getGateId())
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found with ID: " + dto.getGateId()));

        Stand stand = null;
        if (dto.getStandId() != null) {
            stand = standRepository.findByIdForUpdate(dto.getStandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stand not found with ID: " + dto.getStandId()));
        }

        Flight flight = flightRepository.findByIdForUpdate(dto.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + dto.getFlightId()));

        assertWingspanFits(flight, gate);
        assertNoOverlap(flight, gate, stand);

        flight.setGate(gate);
        if (stand != null) {
            flight.setStand(stand);
        }

        Flight saved = flightRepository.save(flight);
        log.info("Gate {} assigned to flight {} (id {}){}", gate.getGateNumber(), flight.getFlightNumber(), flight.getFlightId(),
                stand != null ? ", stand " + stand.getStandNumber() : "");
        return flightService.mapToDTO(saved);
    }

    /** An aircraft wider than the gate's rated wingspan cannot dock there. Unknown sizes are not blocked. */
    private void assertWingspanFits(Flight flight, Gate gate) {
        if (flight.getAircraft() == null || flight.getAircraft().getAircraftType() == null
                || flight.getAircraft().getAircraftType().getWingspanMeters() == null
                || gate.getMaxWingspanMeters() == null) {
            return;
        }
        double span = flight.getAircraft().getAircraftType().getWingspanMeters().doubleValue();
        if (span > gate.getMaxWingspanMeters()) {
            throw new ConflictException(String.format(
                    "Flight %s (%s, %.1f m wingspan) does not fit gate %s, which is rated for %.1f m",
                    flight.getFlightNumber(), flight.getAircraft().getAircraftType().getModelName(), span,
                    gate.getGateNumber(), gate.getMaxWingspanMeters()));
        }
    }

    private void assertNoOverlap(Flight incoming, Gate gate, Stand stand) {
        Window newWin = getGroundOccupancyWindow(incoming);
        if (newWin == null) return;

        // Check Gate conflicts
        List<Flight> gateConflicts = flightRepository.findByGate_GateId(gate.getGateId()).stream()
                .filter(f -> !f.getFlightId().equals(incoming.getFlightId()))
                .filter(f -> !INACTIVE_STATUSES.contains(f.getFlightStatus()))
                .filter(f -> {
                    Window otherWin = getGroundOccupancyWindow(f);
                    return otherWin != null && newWin.start.isBefore(otherWin.end) && otherWin.start.isBefore(newWin.end);
                })
                .toList();

        if (!gateConflicts.isEmpty()) {
            Flight clash = gateConflicts.get(0);
            throw new ConflictException(
                    "Gate " + gate.getGateNumber() + " is already reserved for flight " + clash.getFlightNumber()
                            + " during ground occupancy window (" + newWin.start + " to " + newWin.end + ")");
        }

        // Check Stand conflicts
        if (stand != null) {
            List<Flight> standConflicts = flightRepository.findByStand_StandId(stand.getStandId()).stream()
                    .filter(f -> !f.getFlightId().equals(incoming.getFlightId()))
                    .filter(f -> !INACTIVE_STATUSES.contains(f.getFlightStatus()))
                    .filter(f -> {
                        Window otherWin = getGroundOccupancyWindow(f);
                        return otherWin != null && newWin.start.isBefore(otherWin.end) && otherWin.start.isBefore(newWin.end);
                    })
                    .toList();

            if (!standConflicts.isEmpty()) {
                Flight clash = standConflicts.get(0);
                throw new ConflictException(
                        "Stand " + stand.getStandNumber() + " is already reserved for flight " + clash.getFlightNumber()
                                + " during ground occupancy window (" + newWin.start + " to " + newWin.end + ")");
            }
        }
    }

    private static class Window {
        final ZonedDateTime start;
        final ZonedDateTime end;

        Window(ZonedDateTime start, ZonedDateTime end) {
            this.start = start;
            this.end = end;
        }
    }

    private Window getGroundOccupancyWindow(Flight f) {
        ZonedDateTime start;
        ZonedDateTime end;

        if ("ARRIVAL".equalsIgnoreCase(f.getFlightType())) {
            start = f.getScheduledArrivalTime();
            if (start == null) return null;
            if (f.getScheduledDepartureTime() != null && f.getScheduledDepartureTime().isAfter(start)) {
                end = f.getScheduledDepartureTime();
            } else {
                end = start.plusMinutes(60);
            }
        } else { // DEPARTURE
            end = f.getScheduledDepartureTime();
            if (end == null) return null;
            if (f.getScheduledArrivalTime() != null && f.getScheduledArrivalTime().isBefore(end)) {
                start = f.getScheduledArrivalTime();
            } else {
                start = end.minusMinutes(60);
            }
        }
        return new Window(start, end);
    }
}
