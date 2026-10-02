package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Fetch the acting user in the same query as the page instead of one lookup per row.
    @Override
    @EntityGraph(attributePaths = "user")
    Page<AuditLog> findAll(Pageable pageable);

    List<AuditLog> findByUser_UserId(Long userId);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
