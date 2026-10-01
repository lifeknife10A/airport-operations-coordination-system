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
        return runwayRepository.findAll().stream().map(this::mapToTelemetryDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RunwayTelemetryDTO getRunwayById(Long id) {
        Runway runway = runwayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runway not found with ID: " + id));
        return mapToTelemetryDTO(runway);
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
        return mapToTelemetryDTO(saved);
    }

    private RunwayTelemetryDTO mapToTelemetryDTO(Runway r) {
        return RunwayTelemetryDTO.builder()
                .runwayId(r.getRunwayId())
                .runwayCode(r.getRunwayCode())
                .operationalStatus(r.getOperationalStatus() != null ? r.getOperationalStatus() : "ACTIVE_CAT_III")
                .surfaceFriction(r.getSurfaceFriction() != null ? r.getSurfaceFriction() : new BigDecimal("0.84"))
                .activeIlsFrequency(r.getActiveIlsFrequency() != null ? r.getActiveIlsFrequency() : "110.30 MHz")
                .visualRangeMeters(r.getVisualRangeMeters() != null ? r.getVisualRangeMeters() : 2000)
                .activeDeparturesCount(4)
                .activeArrivalsCount(6)
                .crosswindVector("270° / 12 kts")
                .headwindVector("090° / 08 kts")
                .weatherCondition("VMC - Visual Meteorological Conditions")
                .build();
    }
}
