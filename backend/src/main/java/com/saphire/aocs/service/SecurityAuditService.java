package com.saphire.aocs.service;

import com.saphire.aocs.entity.AuditLog;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.AuditLogRepository;
import com.saphire.aocs.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityAuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    /** Writes an audit entry attributed to the authenticated caller, never to a client-supplied id. */
    @Transactional
    public AuditLog logActionAs(String username, String action, String changePayload) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return logAction(user.getUserId(), action, changePayload);
    }

    @Transactional
    public AuditLog logAction(Long userId, String action, String changePayload) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found ID: " + userId));

        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .changePayload(toJsonPayload(changePayload))
                .createdAt(ZonedDateTime.now())
                .build();
        AuditLog saved = auditLogRepository.save(log);
        SecurityAuditService.log.debug("Audit entry {} written for user {}: {}", saved.getLogId(), userId, action);
        return saved;
    }

    /**
     * change_payload is a jsonb column, but callers (the frontend's audit events) send free text
     * like "Gate A12 assigned to flight X". Postgres rejects non-JSON text outright, so anything
     * that isn't already a JSON object/array is wrapped as {"details": "<text>"} -- the same
     * shape the seeded audit rows use -- instead of failing the whole audit write.
     */
    private String toJsonPayload(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            JsonNode node = objectMapper.readTree(raw);
            if (node.isObject() || node.isArray()) {
                return raw;
            }
        } catch (JsonProcessingException ignored) {
            // not JSON -- wrap below
        }
        try {
            return objectMapper.writeValueAsString(Map.of("details", raw));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not encode audit payload", e);
        }
    }
}
