package com.saphire.aocs.security;

import com.saphire.aocs.entity.AuthSession;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.repository.UserRepository;
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
import java.util.Optional;
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
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, SessionService sessionService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.sessionService = sessionService;
        this.userRepository = userRepository;
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

                // The role is deliberately NOT read from the token: anything signed with a leaked or
                // guessed secret could claim any role. The signed token only proves "this session
                // id was issued"; who the user is and what role they hold right now come from the
                // database, so a role change or removed user takes effect on the next request.
                Optional<AuthSession> session = sessionService.findActiveSession(sessionId);
                Optional<User> user = session.flatMap(s -> userRepository.findById(s.getUserId()));

                if (user.isPresent() && user.get().getRole() != null) {
                    String role = user.get().getRole().getRoleName();
                    String springRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    String username = user.get().getUsername();

                    var authorities = List.of(new SimpleGrantedAuthority(springRole));
                    var authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    request.setAttribute("sessionId", sessionId);
                    request.setAttribute(RequestLoggingFilter.USER_ATTRIBUTE, username);
                } else {
                    // Signature/expiry check passed but the session was logged out or superseded
                    // by a newer login elsewhere -- treat exactly like an invalid token.
                    logger.debug("Rejected token for '" + claims.getSubject() + "': session " + sessionId + " is no longer active");
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
