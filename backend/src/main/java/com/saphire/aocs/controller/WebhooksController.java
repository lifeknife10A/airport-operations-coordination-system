package com.saphire.aocs.controller;

import com.saphire.aocs.dto.BaggageScanDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.WebhookDelayAlertDTO;
import com.saphire.aocs.dto.WebhookFlightStatusDTO;
import com.saphire.aocs.entity.BaggageScanEvent;
import com.saphire.aocs.service.BaggageService;
import com.saphire.aocs.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/webhooks", "/api/v1/webhooks"})
@RequiredArgsConstructor
public class WebhooksController {

    private final FlightService flightService;
    private final BaggageService baggageService;

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PostMapping("/flight-status")
    public ResponseEntity<FlightDTO> flightStatusWebhook(@Valid @RequestBody WebhookFlightStatusDTO dto) {
        FlightDTO updated = flightService.updateFlightStatus(dto.getFlightId(), dto.getStatus());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PostMapping("/baggage-scan")
    public ResponseEntity<BaggageScanEvent> baggageScanWebhook(@Valid @RequestBody BaggageScanDTO dto) {
        BaggageScanEvent event = baggageService.addScanEvent(dto.getTagNumber(), dto.getLocation());
        return ResponseEntity.ok(event);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PostMapping("/delay-alert")
    public ResponseEntity<Map<String, String>> delayAlertWebhook(@Valid @RequestBody WebhookDelayAlertDTO dto) {
        return ResponseEntity.ok(Map.of(
                "status", "ALERT_DISPATCHED",
                "flightNumber", dto.getFlightNumber(),
                "reason", dto.getDelayReason()
        ));
    }
}
