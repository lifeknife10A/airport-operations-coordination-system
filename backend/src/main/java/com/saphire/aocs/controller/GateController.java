package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.GateAssignmentDTO;
import com.saphire.aocs.dto.GateResponseDTO;
import com.saphire.aocs.service.GateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/gates", "/api/v1/gates", "/api/airside/gates", "/api/v1/airside/gates"})
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @GetMapping
    public ResponseEntity<List<GateResponseDTO>> getAllGates() {
        return ResponseEntity.ok(gateService.getAllGates());
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GATE_AGENT', 'GROUND_HANDLING_SUPERVISOR')")
    @PutMapping("/assign")
    public ResponseEntity<FlightDTO> assignGateToFlight(@Valid @RequestBody GateAssignmentDTO dto) {
        FlightDTO updatedFlight = gateService.assignGateToFlight(dto);
        return ResponseEntity.ok(updatedFlight);
    }
}
