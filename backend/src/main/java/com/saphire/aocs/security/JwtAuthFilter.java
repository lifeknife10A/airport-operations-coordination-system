package com.saphire.aocs.security;

import com.saphire.aocs.service.SessionService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Reads "Authorization: Bearer <token>", validates it, and populates the SecurityContext so
 * @PreAuthorize / authorizeHttpRequests() rules downstream have something to check.
 *
 * Also re-checks the token's "sid" claim against SessionService on every request. The JWT
 * signature alone only proves the token hasn't been tampered with -- it says nothing about
 * whether the session behind it has since been logged out or superseded by a newer login
 * elsewhere (single-session-per-user). That's what makes logout actually take effect instead of
 * the old token staying valid until its 24h expiry regardless of logout.
 *
 * Deliberately fails OPEN into "no authentication" (not a hard 401) on a bad/expired/revoked
 * token -- the SecurityFilterChain's authorizeHttpRequests() is what actually rejects the
 * request, which keeps the 401 vs. 403 semantics consistent with the rest of Spring Security
 * instead of this filter short-circuiting the response itself.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final SessionService sessionService;

    public JwtAuthFilter(JwtService jwtService, SessionService sessionService) {
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(header.substring(7));
                UUID sessionId = UUID.fromString(String.valueOf(claims.get("sid")));

                if (sessionService.isSessionActive(sessionId)) {
                    String role = String.valueOf(claims.get("role"));
                    String springRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                    var authorities = List.of(new SimpleGrantedAuthority(springRole));
                    var authToken = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    request.setAttribute("sessionId", sessionId);
                } else {
                    // Signature/expiry check passed but the session was logged out or superseded
                    // by a newer login elsewhere -- treat exactly like an invalid token.
                    SecurityContextHolder.clearContext();
                }
            } catch (JwtException | IllegalArgumentException ignored) {
                // Invalid/expired/malformed token, or no "sid" claim (old pre-session tokens) ->
                // leave unauthenticated. Do NOT write to the response here; let
                // authorizeHttpRequests() decide 401 vs. 403 for this route.
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
