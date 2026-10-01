package com.saphire.aocs.controller;

import com.saphire.aocs.dto.LoginDTO;
import com.saphire.aocs.dto.LoginResponseDTO;
import com.saphire.aocs.exception.UnauthorizedException;
import com.saphire.aocs.service.AuthService;
import com.saphire.aocs.service.LoginAttemptService;
import com.saphire.aocs.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SessionService sessionService;
    private final LoginAttemptService loginAttempts;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginDTO dto, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        loginAttempts.assertNotLocked(dto.getUsername(), ip);
        try {
            LoginResponseDTO response = authService.login(dto);
            loginAttempts.recordSuccess(dto.getUsername());
            return ResponseEntity.ok(response);
        } catch (UnauthorizedException ex) {
            loginAttempts.recordFailure(dto.getUsername(), ip);
            throw ex;
        }
    }

    // Real, server-side logout: revokes the auth_sessions row behind this token so it stops
    // working immediately, instead of the old behaviour (frontend just deletes it from
    // localStorage while the token itself stayed valid for up to 24h if replayed elsewhere).
    // JwtAuthFilter stashes the "sid" claim as a request attribute once it's validated the
    // token, so a request with no valid session simply has nothing to revoke.
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        Object sessionId = request.getAttribute("sessionId");
        if (sessionId instanceof UUID uuid) {
            sessionService.revokeSession(uuid);
        }
        return ResponseEntity.ok().build();
    }
}
