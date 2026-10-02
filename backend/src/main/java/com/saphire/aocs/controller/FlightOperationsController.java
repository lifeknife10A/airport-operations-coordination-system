package com.saphire.aocs.controller;

import com.saphire.aocs.dto.*;
import com.saphire.aocs.service.FlightOperationsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Staff-only operational views of flights (the public flight endpoints are in FlightController). */
@RestController
@RequestMapping({"/api/flights", "/api/v1/flights"})
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FlightOperationsController {

    private final FlightOperationsService flightOperationsService;

    @GetMapping("/{id}/operations")
    public ResponseEntity<FlightOperationsDTO> getOperations(@PathVariable Long id) {
        return ResponseEntity.ok(flightOperationsService.getOperations(id));
    }

    @GetMapping("/delays")
    public ResponseEntity<PagedResponseDTO<DelayEntryDTO>> getDelays(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(flightOperationsService.getDelaysPage(page, size));
    }

    @GetMapping("/delay-codes")
    public ResponseEntity<List<DelayCodeDTO>> getDelayCodes() {
        return ResponseEntity.ok(flightOperationsService.getDelayCodes());
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PostMapping("/{id}/delays")
    public ResponseEntity<DelayEntryDTO> logDelay(@PathVariable Long id, @Valid @RequestBody DelayCreateDTO dto) {
        return new ResponseEntity<>(flightOperationsService.logDelay(id, dto), HttpStatus.CREATED);
    }
}
