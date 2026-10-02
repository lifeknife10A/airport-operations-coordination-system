package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.PagedResponseDTO;
import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // Added alongside the unbounded endpoint above (not replacing it) so existing callers that
    // expect the full list (dashboard KPI counts, pickers, search) keep working unchanged, while
    // any UI that renders a flight table can switch to this and never pull more than `size` rows
    // per request. Default size 10 to match the "10 at a time, prev/next" requirement.
    @GetMapping("/paged")
    public ResponseEntity<PagedResponseDTO<FlightDTO>> getSaphireHubFlightsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(flightService.getSaphireHubFlightsPaged(page, size, query));
    }

    @GetMapping("/schedule")
    public ResponseEntity<PagedResponseDTO<FlightDTO>> getSchedule(
            @RequestParam(defaultValue = "DEPARTURE") String type,
            @RequestParam(required = false) String concourse,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(flightService.getSchedulePage(type, concourse, query, page, size));
    }

    @GetMapping("/schedule/summary")
    public ResponseEntity<java.util.Map<String, Long>> getScheduleSummary() {
        return ResponseEntity.ok(flightService.getScheduleSummary());
    }

    @GetMapping("/operational")
    public ResponseEntity<List<FlightDTO>> getOperationalFlights(@RequestParam(defaultValue = "40") int limit) {
        return ResponseEntity.ok(flightService.getOperationalFlights(limit));
    }

    @GetMapping("/status-summary")
    public ResponseEntity<java.util.Map<String, Long>> getFlightStatusSummary() {
        return ResponseEntity.ok(flightService.getFlightStatusSummary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PostMapping
    public ResponseEntity<FlightDTO> createFlight(@Valid @RequestBody FlightCreateDTO dto) {
        FlightDTO created = flightService.createFlight(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GATE_AGENT')")
    @PutMapping("/{id}/runway")
    public ResponseEntity<FlightDTO> assignRunway(@PathVariable Long id, @Valid @RequestBody com.saphire.aocs.dto.RunwayAssignmentDTO dto) {
        return ResponseEntity.ok(flightService.assignRunway(id, dto.getRunwayId()));
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GROUND_HANDLING_SUPERVISOR', 'RAMP_AGENT', 'GATE_AGENT')")
    @PutMapping("/{id}/status")
    public ResponseEntity<FlightDTO> updateFlightStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusUpdateDTO) {
        FlightDTO updated = flightService.updateFlightStatus(id, statusUpdateDTO.getStatus());
        return ResponseEntity.ok(updated);
    }
}
