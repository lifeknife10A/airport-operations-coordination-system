package com.saphire.aocs.service;

import com.saphire.aocs.dto.AirsideConflictDTO;
import com.saphire.aocs.dto.AirsideConflictsDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

/**
 * Airside planning conflicts, computed on demand from live flight, gate and aircraft data so they
 * can never go stale or disagree with the rest of the system.
 */
@Service
@RequiredArgsConstructor
public class AirsideConflictService {

    private static final int MAX_LIMIT = 100;

    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public AirsideConflictsDTO getConflicts(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, MAX_LIMIT));

        long gateTotal = flightRepository.countGateOverlaps();
        List<AirsideConflictDTO> items = new ArrayList<>();
        for (Object[] r : flightRepository.findGateOverlaps(safeLimit)) {
            String first = String.valueOf(r[1]);
            String second = String.valueOf(r[2]);
            String gate = String.valueOf(r[3]);
            items.add(AirsideConflictDTO.builder()
                    .type("GATE_CONFLICT").severity("CRITICAL")
                    .flightId(((Number) r[0]).longValue())
                    .flightNumber(first).otherFlightNumber(second).gateNumber(gate)
                    .scheduledDeparture(r[4] instanceof Timestamp ts ? ts.toInstant().atZone(ZoneId.systemDefault()) : null)
                    .title("Gate " + gate + " double-booked")
                    .description(first + " and " + second + " are both on gate " + gate
                            + " with departures less than 15 minutes apart.")
                    .build());
        }

        Page<Flight> wingspan = flightRepository.findWingspanConflicts(PageRequest.of(0, safeLimit));
        for (Flight f : wingspan.getContent()) {
            double span = f.getAircraft().getAircraftType().getWingspanMeters().doubleValue();
            double limitSpan = f.getGate().getMaxWingspanMeters();
            items.add(AirsideConflictDTO.builder()
                    .type("WINGSPAN_OVERSIZE")
                    .severity("BOARDING".equals(f.getFlightStatus()) ? "CRITICAL" : "WARNING")
                    .flightId(f.getFlightId()).flightNumber(f.getFlightNumber())
                    .gateNumber(f.getGate().getGateNumber())
                    .aircraftWingspanMeters(span).gateMaxWingspanMeters(limitSpan)
                    .scheduledDeparture(f.getScheduledDepartureTime())
                    .title(f.getAircraft().getAircraftType().getModelName() + " exceeds gate " + f.getGate().getGateNumber() + " limit")
                    .description(String.format("%s has a %.1f m wingspan; gate %s is rated for %.1f m.",
                            f.getFlightNumber(), span, f.getGate().getGateNumber(), limitSpan))
                    .build());
        }

        return AirsideConflictsDTO.builder()
                .total(gateTotal + wingspan.getTotalElements())
                .gateConflicts(gateTotal)
                .wingspanOversize(wingspan.getTotalElements())
                .items(items.size() > safeLimit ? items.subList(0, safeLimit) : items)
                .build();
    }
}
