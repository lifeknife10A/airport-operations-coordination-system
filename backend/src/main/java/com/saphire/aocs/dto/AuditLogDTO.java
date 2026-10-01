package com.saphire.aocs.dto;

import com.saphire.aocs.entity.AuditLog;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

/** Audit entry as returned over the API: who did it, without exposing the User entity itself. */
@Data
@Builder
public class AuditLogDTO {
    private Long logId;
    private String action;
    private String entityType;
    private Long entityId;
    private String changePayload;
    private Long userId;
    private String username;
    private ZonedDateTime createdAt;

    public static AuditLogDTO from(AuditLog log) {
        return AuditLogDTO.builder()
                .logId(log.getLogId())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .changePayload(log.getChangePayload())
                .userId(log.getUser() == null ? null : log.getUser().getUserId())
                .username(log.getUser() == null ? null : log.getUser().getUsername())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
