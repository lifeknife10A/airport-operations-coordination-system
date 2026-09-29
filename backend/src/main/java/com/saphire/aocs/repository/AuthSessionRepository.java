package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AuthSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, UUID> {

    List<AuthSession> findByUserIdAndRevokedAtIsNull(Long userId);

    Optional<AuthSession> findBySessionIdAndRevokedAtIsNull(UUID sessionId);

    // Bulk-revokes every still-active session for a user in one statement -- used at login time
    // for single-session-per-user enforcement (a fresh login kicks out any prior session).
    @Modifying
    @Query("UPDATE AuthSession s SET s.revokedAt = :now, s.revokedReason = :reason WHERE s.userId = :userId AND s.revokedAt IS NULL")
    int revokeAllActiveForUser(@Param("userId") Long userId, @Param("now") ZonedDateTime now, @Param("reason") String reason);
}
