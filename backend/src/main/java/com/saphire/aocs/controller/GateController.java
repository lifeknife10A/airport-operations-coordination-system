package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.GateAssignmentDTO;
import com.saphire.aocs.dto.GateResponseDTO;
import com.saphire.aocs.service.GateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gates")
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @GetMapping
    public ResponseEntity<List<GateResponseDTO>> getAllGates() {
        return ResponseEntity.ok(gateService.getAllGates());
    }

    @PutMapping("/assign")
    public ResponseEntity<FlightDTO> assignGateToFlight(@Valid @RequestBody GateAssignmentDTO dto) {
        FlightDTO updatedFlight = gateService.assignGateToFlight(dto);
        return ResponseEntity.ok(updatedFlight);
    }
}
