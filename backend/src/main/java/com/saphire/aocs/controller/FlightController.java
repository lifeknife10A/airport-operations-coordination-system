package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/flights", "/api/v1/flights"})
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAllSaphireHubFlights() {
        return ResponseEntity.ok(flightService.getSaphireHubFlights());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PostMapping
    public ResponseEntity<FlightDTO> createFlight(@Valid @RequestBody FlightCreateDTO dto) {
        FlightDTO created = flightService.createFlight(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FlightDTO> updateFlightStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusUpdateDTO) {
        FlightDTO updated = flightService.updateFlightStatus(id, statusUpdateDTO.getStatus());
        return ResponseEntity.ok(updated);
    }
}
