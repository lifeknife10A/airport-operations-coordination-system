package com.saphire.aocs.service;

import com.saphire.aocs.dto.RunwayStatusUpdateDTO;
import com.saphire.aocs.dto.RunwayTelemetryDTO;
import com.saphire.aocs.entity.Runway;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.RunwayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AirsideTelemetryService {

    private final RunwayRepository runwayRepository;
    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public List<RunwayTelemetryDTO> getAllRunways() {
        java.util.Map<Long, int[]> traffic = new java.util.HashMap<>();   // runway id -> {departures, arrivals}
        for (Object[] row : flightRepository.countRunwayTraffic()) {
            int[] counts = traffic.computeIfAbsent((Long) row[0], k -> new int[2]);
            counts["DEPARTURE".equals(row[1]) ? 0 : 1] = ((Number) row[2]).intValue();
        }
        return runwayRepository.findAll().stream()
                .map(r -> mapToTelemetryDTO(r, traffic.getOrDefault(r.getRunwayId(), new int[2])))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RunwayTelemetryDTO getRunwayById(Long id) {
        Runway runway = runwayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runway not found with ID: " + id));
        return mapToTelemetryDTO(runway, trafficFor(runway.getRunwayId()));
    }

    private int[] trafficFor(Long runwayId) {
        int[] counts = new int[2];
        for (Object[] row : flightRepository.countRunwayTraffic()) {
            if (runwayId.equals(row[0])) counts["DEPARTURE".equals(row[1]) ? 0 : 1] = ((Number) row[2]).intValue();
        }
        return counts;
    }

    @Transactional
    public RunwayTelemetryDTO updateRunwayStatus(Long id, RunwayStatusUpdateDTO dto) {
        Runway runway = runwayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runway not found with ID: " + id));

        if (dto.getOperationalStatus() != null) {
            runway.setOperationalStatus(dto.getOperationalStatus());
        }
        if (dto.getSurfaceFriction() != null) {
            runway.setSurfaceFriction(dto.getSurfaceFriction());
        }
        if (dto.getVisualRangeMeters() != null) {
            runway.setVisualRangeMeters(dto.getVisualRangeMeters());
        }

        Runway saved = runwayRepository.save(runway);
        return mapToTelemetryDTO(saved, trafficFor(saved.getRunwayId()));
    }

    /** Wind and weather are left null: there is no weather feed, so none is invented. */
    private RunwayTelemetryDTO mapToTelemetryDTO(Runway r, int[] traffic) {
        return RunwayTelemetryDTO.builder()
                .runwayId(r.getRunwayId())
                .runwayCode(r.getRunwayCode())
                .operationalStatus(r.getOperationalStatus() != null ? r.getOperationalStatus() : "ACTIVE_CAT_III")
                .surfaceFriction(r.getSurfaceFriction() != null ? r.getSurfaceFriction() : new BigDecimal("0.84"))
                .activeIlsFrequency(r.getActiveIlsFrequency() != null ? r.getActiveIlsFrequency() : "110.30 MHz")
                .visualRangeMeters(r.getVisualRangeMeters() != null ? r.getVisualRangeMeters() : 2000)
                .activeDeparturesCount(traffic[0])
                .activeArrivalsCount(traffic[1])
                .build();
    }
}
