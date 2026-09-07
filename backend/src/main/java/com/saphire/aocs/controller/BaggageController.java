package com.saphire.aocs.controller;

import com.saphire.aocs.entity.BagTag;
import com.saphire.aocs.entity.BaggageScanEvent;
import com.saphire.aocs.entity.MishandledBaggage;
import com.saphire.aocs.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/baggage", "/api/v1/baggage"})
@RequiredArgsConstructor
public class BaggageController {

    private final BaggageService baggageService;

    @GetMapping("/track/{tagNumber}")
    public ResponseEntity<Map<String, Object>> trackBag(@PathVariable String tagNumber) {
        BagTag bagTag = baggageService.getBagByTagNumber(tagNumber);
        List<BaggageScanEvent> scanEvents = baggageService.getScanHistoryByTagNumber(tagNumber);
        return ResponseEntity.ok(Map.of(
                "bagTag", bagTag,
                "scanEvents", scanEvents
        ));
    }

    @PostMapping("/scan")
    public ResponseEntity<BaggageScanEvent> recordScan(@RequestBody Map<String, String> payload) {
        String tagNumber = payload.get("tagNumber");
        String location = payload.get("location");
        BaggageScanEvent event = baggageService.addScanEvent(tagNumber, location);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @PostMapping("/mishandled")
    public ResponseEntity<MishandledBaggage> reportMishandledBag(@RequestBody Map<String, Object> payload) {
        String claimNumber = (String) payload.get("claimNumber");
        String incidentType = (String) payload.get("incidentType");
        String tagNumber = (String) payload.get("tagNumber");
        Long passengerId = Long.valueOf(payload.get("passengerId").toString());

        MishandledBaggage report = baggageService.createMishandledReport(claimNumber, incidentType, tagNumber, passengerId);
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @GetMapping("/mishandled")
    public ResponseEntity<List<MishandledBaggage>> getMishandledReports() {
        return ResponseEntity.ok(baggageService.getAllMishandledReports());
    }
}
