package com.saphire.aocs.controller;

import com.saphire.aocs.entity.ImmigrationRecord;
import com.saphire.aocs.entity.Passenger;
import com.saphire.aocs.entity.PassengerClearanceLog;
import com.saphire.aocs.entity.Traveler;
import com.saphire.aocs.service.BorderControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/border-control", "/api/v1/border-control"})
@RequiredArgsConstructor
public class BorderControlController {

    private final BorderControlService borderControlService;

    @GetMapping("/passport/{passportNumber}")
    public ResponseEntity<Map<String, Object>> lookupPassport(@PathVariable String passportNumber) {
        Traveler traveler = borderControlService.getTravelerByPassport(passportNumber);
        List<Passenger> flightSegments = borderControlService.getPassengerHistoryByPassport(passportNumber);
        return ResponseEntity.ok(Map.of(
                "traveler", traveler,
                "flightSegments", flightSegments
        ));
    }

    @PostMapping("/clearance")
    public ResponseEntity<PassengerClearanceLog> logClearance(@RequestBody Map<String, Object> payload) {
        Long passengerId = Long.valueOf(payload.get("passengerId").toString());
        String clearanceStatus = (String) payload.get("clearanceStatus");
        String denialReason = (String) payload.get("denialReason");
        String verificationMethod = (String) payload.get("verificationMethod");
        Long boardingPassId = payload.get("boardingPassId") != null ? Long.valueOf(payload.get("boardingPassId").toString()) : 1L;
        Long checkpointId = payload.get("checkpointId") != null ? Long.valueOf(payload.get("checkpointId").toString()) : 1L;

        PassengerClearanceLog log = borderControlService.logClearance(passengerId, clearanceStatus, denialReason, verificationMethod, boardingPassId, checkpointId);
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }

    @PostMapping("/immigration")
    public ResponseEntity<ImmigrationRecord> logImmigration(@RequestBody Map<String, Object> payload) {
        Long passengerId = Long.valueOf(payload.get("passengerId").toString());
        String visaType = (String) payload.get("visaType");
        String stampNumber = (String) payload.get("stampNumber");
        Boolean biometricMatched = Boolean.valueOf(payload.get("biometricFacialMatched").toString());
        String clearanceType = (String) payload.get("clearanceType");

        ImmigrationRecord record = borderControlService.logImmigrationStamp(passengerId, visaType, stampNumber, biometricMatched, clearanceType);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }
}
