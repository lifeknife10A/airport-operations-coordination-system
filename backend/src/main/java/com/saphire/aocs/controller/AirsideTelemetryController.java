package com.saphire.aocs.controller;

import com.saphire.aocs.dto.RunwayStatusUpdateDTO;
import com.saphire.aocs.dto.RunwayTelemetryDTO;
import com.saphire.aocs.service.AirsideTelemetryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/airside/runways", "/api/v1/airside/runways"})
@RequiredArgsConstructor
public class AirsideTelemetryController {

    private final AirsideTelemetryService airsideTelemetryService;

    @GetMapping
    public ResponseEntity<List<RunwayTelemetryDTO>> getAllRunways() {
        return ResponseEntity.ok(airsideTelemetryService.getAllRunways());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RunwayTelemetryDTO> getRunwayById(@PathVariable Long id) {
        return ResponseEntity.ok(airsideTelemetryService.getRunwayById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RunwayTelemetryDTO> updateRunwayStatus(
            @PathVariable Long id,
            @Valid @RequestBody RunwayStatusUpdateDTO dto) {
        return ResponseEntity.ok(airsideTelemetryService.updateRunwayStatus(id, dto));
    }
}
