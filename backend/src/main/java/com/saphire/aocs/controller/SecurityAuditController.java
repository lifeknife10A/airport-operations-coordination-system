package com.saphire.aocs.controller;

import com.saphire.aocs.entity.AuditLog;
import com.saphire.aocs.service.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class SecurityAuditController {

    private final SecurityAuditService auditService;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getAllAuditLogs());
    }

    @PostMapping("/log-action")
    public ResponseEntity<AuditLog> logAction(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String action = (String) payload.get("action");
        String changePayload = (String) payload.get("changePayload");

        AuditLog log = auditService.logAction(userId, action, changePayload);
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }
}
