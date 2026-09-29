package com.saphire.aocs.controller;

import com.saphire.aocs.entity.AuditLog;
import com.saphire.aocs.service.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Method-level, not class-level: log-action is any staff member recording their own action (gate
// reassignment, status changes, etc. all write an audit entry as the acting user) and needs to
// stay open to every authenticated role. Reading the full system-wide audit trail is a different,
// admin-only concern.
@RestController
@RequestMapping({"/api/audit", "/api/v1/audit"})
@RequiredArgsConstructor
public class SecurityAuditController {

    private final SecurityAuditService auditService;

    @GetMapping("/logs")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
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
