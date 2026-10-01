package com.saphire.aocs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expiryMs;

    public JwtService(
            @Value("${aocs.jwt.secret:}") String secret,
            @Value("${aocs.jwt.expiration-ms:86400000}") long expiryMs) {
        byte[] keyBytes;
        if (secret == null || secret.isBlank()) {
            // No secret configured: generate a random one for this run instead of falling back to
            // a value committed to a public repo (anyone could forge tokens with that). The cost
            // is that tokens stop validating after a restart, so users log in again. Real
            // deployments set AOCS_JWT_SECRET (required, no default, under the prod profile).
            keyBytes = new byte[48];
            new java.security.SecureRandom().nextBytes(keyBytes);
            org.slf4j.LoggerFactory.getLogger(JwtService.class).warn(
                    "aocs.jwt.secret is not set -- using a random per-run secret; sessions will not survive a restart");
        } else {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        if (keyBytes.length < 32) {
            throw new IllegalStateException("aocs.jwt.secret must be at least 32 bytes for HS256 algorithm (got " + keyBytes.length + ")");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expiryMs = expiryMs;
    }

    public String issueToken(Long userId, String username, String roleName, java.util.UUID sessionId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);
        return Jwts.builder()
                .subject(username)
                .claims(Map.of(
                        "userId", userId,
                        "role", roleName == null ? "" : roleName,
                        "sid", sessionId.toString()))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public long getExpiryMs() {
        return expiryMs;
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
