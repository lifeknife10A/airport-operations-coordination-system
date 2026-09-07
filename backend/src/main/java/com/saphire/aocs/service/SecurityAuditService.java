package com.saphire.aocs.service;

import com.saphire.aocs.entity.AuditLog;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.AuditLogRepository;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityAuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Transactional
    public AuditLog logAction(Long userId, String action, String changePayload) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found ID: " + userId));

        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .changePayload(changePayload)
                .createdAt(ZonedDateTime.now())
                .build();
        return auditLogRepository.save(log);
    }
}
