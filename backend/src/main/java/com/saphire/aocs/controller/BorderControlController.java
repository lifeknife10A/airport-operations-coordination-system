package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ClearanceLogDTO;
import com.saphire.aocs.dto.ImmigrationLogDTO;
import com.saphire.aocs.entity.ImmigrationRecord;
import com.saphire.aocs.entity.Passenger;
import com.saphire.aocs.entity.PassengerClearanceLog;
import com.saphire.aocs.entity.Traveler;
import com.saphire.aocs.service.BorderControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Passport lookups and immigration/clearance records are the most sensitive PII this system
// handles. Authentication alone (any valid staff session) used to be enough to reach these --
// now restricted to the roles whose job actually involves border control, matching the real
// seeded role_name values (roles.role_name in the DB), not the guessed ones SecurityConfig's
// old comment referenced.
@RestController
@RequestMapping({"/api/border-control", "/api/v1/border-control"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('IMMIGRATION_OFFICER', 'SECURITY_OFFICER', 'SYSTEM_ADMINISTRATOR')")
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
    public ResponseEntity<PassengerClearanceLog> logClearance(@Valid @RequestBody ClearanceLogDTO dto) {
        // These used to default to id 1, silently attributing a scan to a stranger's boarding pass
        // and an arbitrary checkpoint. Both are now required.
        if (dto.getBoardingPassId() == null || dto.getCheckpointId() == null) {
            throw new com.saphire.aocs.exception.BadRequestException("boardingPassId and checkpointId are required");
        }
        Long boardingPassId = dto.getBoardingPassId();
        Long checkpointId = dto.getCheckpointId();

        PassengerClearanceLog log = borderControlService.logClearance(dto.getPassengerId(), dto.getClearanceStatus(),
                dto.getDenialReason(), dto.getVerificationMethod(), boardingPassId, checkpointId);
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }

    @PostMapping("/immigration")
    public ResponseEntity<ImmigrationRecord> logImmigration(@Valid @RequestBody ImmigrationLogDTO dto) {
        ImmigrationRecord record = borderControlService.logImmigrationStamp(dto.getPassengerId(), dto.getVisaType(),
                dto.getStampNumber(), dto.getBiometricFacialMatched(), dto.getClearanceType());
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }
}
