package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.entity.BaggageScanEvent;
import com.saphire.aocs.service.BaggageService;
import com.saphire.aocs.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhooksController {

    private final FlightService flightService;
    private final BaggageService baggageService;

    @PostMapping("/flight-status")
    public ResponseEntity<FlightDTO> flightStatusWebhook(@RequestBody Map<String, Object> payload) {
        Long flightId = Long.valueOf(payload.get("flightId").toString());
        String status = (String) payload.get("status");
        FlightDTO updated = flightService.updateFlightStatus(flightId, status);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/baggage-scan")
    public ResponseEntity<BaggageScanEvent> baggageScanWebhook(@RequestBody Map<String, String> payload) {
        String tagNumber = payload.get("tagNumber");
        String location = payload.get("location");
        BaggageScanEvent event = baggageService.addScanEvent(tagNumber, location);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/delay-alert")
    public ResponseEntity<Map<String, String>> delayAlertWebhook(@RequestBody Map<String, Object> payload) {
        String flightNumber = (String) payload.get("flightNumber");
        String delayReason = (String) payload.get("delayReason");
        return ResponseEntity.ok(Map.of(
                "status", "ALERT_DISPATCHED",
                "flightNumber", flightNumber,
                "reason", delayReason
        ));
    }
}
