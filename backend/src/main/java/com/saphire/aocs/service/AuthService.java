package com.saphire.aocs.service;

import com.saphire.aocs.dto.LoginDTO;
import com.saphire.aocs.dto.LoginResponseDTO;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.UnauthorizedException;
import com.saphire.aocs.repository.UserRepository;
import com.saphire.aocs.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Original bug: login(dto) looked the user up by username and returned their full profile with
 * NO password comparison at all — dto.getPassword() was read off the wire and never referenced
 * again. Anyone who knew (or guessed) a username could authenticate as that user. There was
 * also no token in the response, so even a correct password check would have had nothing for
 * the frontend to send on the next request.
 *
 * Both are fixed here: a real PasswordEncoder.matches() check, and a signed JWT on success.
 *
 * ASSUMPTION FLAGGED FOR THE TEAM: this calls user.getPasswordHash(), which exists in
 * ER_Diagram_Design.md's USERS table but NOT in operational_flow_and_data_dictionary.md's
 * version of the same table (that one has no password column at all). If your live schema
 * matches the latter, add a Flyway migration for a password_hash column — and a one-time
 * migration script to BCrypt-hash whatever placeholder credentials are currently in the seed
 * data — before this will run against real data.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    // Same message, same exception type, whether the username doesn't exist or the password is
    // wrong. Distinguishing the two in the response lets a caller enumerate valid usernames.
    private static final String GENERIC_FAILURE = "Invalid username or password";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginDTO dto) {
        // dto.username/password are already guaranteed non-blank by @NotBlank + the fixed
        // GlobalExceptionHandler (see exception/GlobalExceptionHandler.java) — no need to
        // hand-roll that check here the way the original did.
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new UnauthorizedException(GENERIC_FAILURE));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException(GENERIC_FAILURE);
        }

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : null;
        String token = jwtService.issueToken(user.getUserId(), user.getUsername(), roleName);

        return LoginResponseDTO.builder()
                .token(token)
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .roleId(user.getRole() != null ? user.getRole().getRoleId() : null)
                .roleName(roleName)
                .departmentId(user.getDepartment() != null ? user.getDepartment().getDepartmentId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null)
                .build();
    }
}
