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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
        List<Flight> liveFlights = flightRepository.findAllSaphireHubFlightsWithAllDetails().stream()
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

            return GateResponseDTO.builder()
                    .gateId(gate.getGateId())
                    .gateNumber(gate.getGateNumber())
                    .stands(standsForGate)
                    .activeFlights(activeFlights)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public FlightDTO assignGateToFlight(GateAssignmentDTO dto) {
        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + dto.getFlightId()));

        Gate gate = gateRepository.findById(dto.getGateId())
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found with ID: " + dto.getGateId()));

        Stand stand = null;
        if (dto.getStandId() != null) {
            stand = standRepository.findById(dto.getStandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stand not found with ID: " + dto.getStandId()));
        }

        assertNoOverlap(flight, gate, stand);

        flight.setGate(gate);
        if (stand != null) {
            flight.setStand(stand);
        }

        Flight saved = flightRepository.save(flight);
        return flightService.mapToDTO(saved);
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
