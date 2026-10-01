package com.saphire.aocs.service;

import com.saphire.aocs.entity.AuthSession;
import com.saphire.aocs.repository.AuthSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * Server-side record of "who is logged in right now", layered on top of the otherwise-stateless
 * JWT. Each login creates one row here and the session's UUID travels inside the JWT as the
 * "sid" claim (see JwtService); JwtAuthFilter re-checks this table on every request so a revoked
 * session stops working immediately instead of staying valid until the token's 24h expiry.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

    private final AuthSessionRepository authSessionRepository;

    /**
     * Starts a new session for this user and revokes every other still-active session they had
     * (single-session-per-user: logging in somewhere new signs you out everywhere else).
     */
    @Transactional
    public AuthSession createSession(Long userId, long expiryMs) {
        ZonedDateTime now = ZonedDateTime.now();
        int superseded = authSessionRepository.revokeAllActiveForUser(userId, now, "SUPERSEDED_BY_NEW_LOGIN");
        if (superseded > 0) {
            log.info("User {} logged in again: revoked {} earlier active session(s)", userId, superseded);
        }

        AuthSession session = AuthSession.builder()
                .sessionId(UUID.randomUUID())
                .userId(userId)
                .issuedAt(now)
                .expiresAt(now.plusNanos(expiryMs * 1_000_000L))
                .build();
        return authSessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<AuthSession> findActiveSession(UUID sessionId) {
        if (sessionId == null) return java.util.Optional.empty();
        return authSessionRepository.findBySessionIdAndRevokedAtIsNull(sessionId)
                .filter(s -> s.getExpiresAt().isAfter(ZonedDateTime.now()));
    }

    @Transactional(readOnly = true)
    public boolean isSessionActive(UUID sessionId) {
        return findActiveSession(sessionId).isPresent();
    }

    @Transactional
    public void revokeSession(UUID sessionId) {
        if (sessionId == null) return;
        authSessionRepository.findBySessionIdAndRevokedAtIsNull(sessionId)
                .ifPresent(session -> {
                    session.setRevokedAt(ZonedDateTime.now());
                    session.setRevokedReason("LOGOUT");
                    authSessionRepository.save(session);
                    log.info("Logout: session {} of user {} revoked", sessionId, session.getUserId());
                });
    }
}
