package com.saphire.aocs.controller;

import com.saphire.aocs.dto.PagedResponseDTO;
import com.saphire.aocs.dto.SecurityOps.*;
import com.saphire.aocs.service.SecurityOpsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** The Passenger Security desk: boarding clearance, incidents and lounges. Officers and above only. */
@RestController
@RequestMapping({"/api/security-ops", "/api/v1/security-ops"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SECURITY_OFFICER', 'IMMIGRATION_OFFICER', 'SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
public class SecurityOpsController {

    private final SecurityOpsService securityOpsService;

    @GetMapping("/gate-flights")
    public List<GateFlight> gateFlights(@RequestParam(defaultValue = "12") int limit) {
        return securityOpsService.getGateFlights(limit);
    }

    @GetMapping("/flights/{flightId}/manifest")
    public List<ManifestEntry> manifest(@PathVariable Long flightId) {
        return securityOpsService.getManifest(flightId);
    }

    @GetMapping("/checkpoints")
    public List<Checkpoint> checkpoints() {
        return securityOpsService.getCheckpoints();
    }

    @GetMapping("/clearance-log")
    public PagedResponseDTO<ClearanceEntry> clearanceLog(@RequestParam(required = false) String status,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "25") int size) {
        return securityOpsService.getClearanceLog(status, page, size);
    }

    @PostMapping("/clearance")
    public ResponseEntity<ClearanceEntry> logClearance(@Valid @RequestBody ClearanceCreate dto) {
        return new ResponseEntity<>(securityOpsService.logClearance(dto), HttpStatus.CREATED);
    }

    @GetMapping("/incidents")
    public PagedResponseDTO<Incident> incidents(@RequestParam(required = false) String status,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "25") int size) {
        return securityOpsService.getIncidents(status, page, size);
    }

    @PostMapping("/incidents")
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody IncidentCreate dto, Authentication authentication) {
        return new ResponseEntity<>(securityOpsService.createIncident(dto, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/incidents/{id}/status")
    public Incident updateIncidentStatus(@PathVariable Long id, @Valid @RequestBody IncidentStatusUpdate dto, Authentication authentication) {
        return securityOpsService.updateIncidentStatus(id, dto.status(), authentication.getName());
    }

    @GetMapping("/lounges")
    public List<Lounge> lounges() {
        return securityOpsService.getLounges();
    }

    @GetMapping("/lounge-visits")
    public PagedResponseDTO<LoungeVisit> loungeVisits(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "25") int size) {
        return securityOpsService.getLoungeVisits(page, size);
    }

    @PostMapping("/lounge-visits")
    public ResponseEntity<LoungeVisit> logLoungeVisit(@Valid @RequestBody LoungeVisitCreate dto) {
        return new ResponseEntity<>(securityOpsService.logLoungeVisit(dto), HttpStatus.CREATED);
    }
}
