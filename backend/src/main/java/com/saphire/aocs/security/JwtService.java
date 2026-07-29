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
            @Value("${aocs.jwt.secret}") String secret,
            @Value("${aocs.jwt.expiration-ms:86400000}") long expiryMs) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("aocs.jwt.secret must be at least 32 bytes for HS256 algorithm (got " + keyBytes.length + ")");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expiryMs = expiryMs;
    }

    public String issueToken(Long userId, String username, String roleName) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);
        return Jwts.builder()
                .subject(username)
                .claims(Map.of("userId", userId, "role", roleName == null ? "" : roleName))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
