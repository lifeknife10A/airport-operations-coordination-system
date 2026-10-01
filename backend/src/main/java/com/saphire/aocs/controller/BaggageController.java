package com.saphire.aocs.controller;

import com.saphire.aocs.dto.BaggageScanDTO;
import com.saphire.aocs.dto.MishandledBaggageReportDTO;
import com.saphire.aocs.entity.BagTag;
import com.saphire.aocs.entity.BaggageScanEvent;
import com.saphire.aocs.entity.MishandledBaggage;
import com.saphire.aocs.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/baggage", "/api/v1/baggage"})
@RequiredArgsConstructor
public class BaggageController {

    private final BaggageService baggageService;

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'BAGGAGE_HANDLER', 'GROUND_HANDLING_SUPERVISOR', 'RAMP_AGENT', 'CHECKIN_AGENT', 'SECURITY_OFFICER')")
    @GetMapping("/track/{tagNumber}")
    public ResponseEntity<Map<String, Object>> trackBag(@PathVariable String tagNumber) {
        BagTag bagTag = baggageService.getBagByTagNumber(tagNumber);
        List<BaggageScanEvent> scanEvents = baggageService.getScanHistoryByTagNumber(tagNumber);
        return ResponseEntity.ok(Map.of(
                "bagTag", bagTag,
                "scanEvents", scanEvents
        ));
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'BAGGAGE_HANDLER', 'GROUND_HANDLING_SUPERVISOR', 'RAMP_AGENT', 'CHECKIN_AGENT')")
    @PostMapping("/scan")
    public ResponseEntity<BaggageScanEvent> recordScan(@Valid @RequestBody BaggageScanDTO dto) {
        BaggageScanEvent event = baggageService.addScanEvent(dto.getTagNumber(), dto.getLocation());
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'BAGGAGE_HANDLER', 'GROUND_HANDLING_SUPERVISOR')")
    @PostMapping("/mishandled")
    public ResponseEntity<MishandledBaggage> reportMishandledBag(@Valid @RequestBody MishandledBaggageReportDTO dto) {
        MishandledBaggage report = baggageService.createMishandledReport(
                dto.getClaimNumber(), dto.getIncidentType(), dto.getTagNumber(), dto.getPassengerId());
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'BAGGAGE_HANDLER', 'GROUND_HANDLING_SUPERVISOR', 'SECURITY_OFFICER')")
    @GetMapping("/mishandled")
    public ResponseEntity<List<MishandledBaggage>> getMishandledReports() {
        return ResponseEntity.ok(baggageService.getAllMishandledReports());
    }
}
