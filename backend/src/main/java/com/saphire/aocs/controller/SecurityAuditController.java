package com.saphire.aocs.controller;

import com.saphire.aocs.dto.AuditActionDTO;
import com.saphire.aocs.dto.AuditLogDTO;
import com.saphire.aocs.service.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
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
    public ResponseEntity<com.saphire.aocs.dto.PagedResponseDTO<AuditLogDTO>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        var result = auditService.getAuditLogsPage(page, size);
        return ResponseEntity.ok(com.saphire.aocs.dto.PagedResponseDTO.<AuditLogDTO>builder()
                .content(result.getContent().stream().map(AuditLogDTO::from).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build());
    }

    @PostMapping("/log-action")
    public ResponseEntity<AuditLogDTO> logAction(@Valid @RequestBody AuditActionDTO dto, Authentication auth) {
        // Attributed to whoever is authenticated, not to a userId from the request body.
        var log = auditService.logActionAs(auth.getName(), dto.getAction(), dto.getChangePayload());
        return new ResponseEntity<>(AuditLogDTO.from(log), HttpStatus.CREATED);
    }
}
