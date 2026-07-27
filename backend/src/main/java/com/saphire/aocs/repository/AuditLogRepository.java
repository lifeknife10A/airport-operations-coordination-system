package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUser_UserId(Long userId);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
