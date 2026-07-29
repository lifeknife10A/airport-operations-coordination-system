package com.saphire.aocs.service;

import com.saphire.aocs.dto.LoginDTO;
import com.saphire.aocs.dto.LoginResponseDTO;
import com.saphire.aocs.entity.Department;
import com.saphire.aocs.entity.Role;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.UnauthorizedException;
import com.saphire.aocs.repository.UserRepository;
import com.saphire.aocs.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Service-layer tests for AuthService -- the class holding the most serious finding in the
 * review: the original never compared the submitted password to anything at all, so knowing a
 * username was sufficient to authenticate as that user.
 *
 * The original AuthControllerTest had exactly one test, for the happy path, with a fully mocked
 * AuthService -- meaning the auth bypass was invisible to the entire test suite.
 *
 * Written against the REFACTORED AuthService.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks private AuthService authService;

    private User adminUser() {
        return User.builder()
                .userId(1L)
                .username("krishna.s")
                .name("Krishna Solanki")
                .passwordHash("$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012")
                .role(Role.builder().roleId(1L).roleName("ROLE_ADMIN").build())
                .department(Department.builder().departmentId(2L).departmentName("Ground Handling").build())
                .build();
    }

    @Test
    @DisplayName("a wrong password is rejected (the original accepted anything)")
    void wrongPassword_ShouldThrowUnauthorized() {
        when(userRepository.findByUsername("krishna.s")).thenReturn(Optional.of(adminUser()));
        when(passwordEncoder.matches(eq("wrong-password"), anyString())).thenReturn(false);

        LoginDTO dto = LoginDTO.builder().username("krishna.s").password("wrong-password").build();

        assertThatThrownBy(() -> authService.login(dto))
                .isInstanceOf(UnauthorizedException.class);

        // No token may be minted on a failed authentication.
        verify(jwtService, never()).issueToken(any(), anyString(), anyString());
    }

    @Test
    @DisplayName("an empty password is rejected")
    void emptyPassword_ShouldThrowUnauthorized() {
        when(userRepository.findByUsername("krishna.s")).thenReturn(Optional.of(adminUser()));
        when(passwordEncoder.matches(eq(""), anyString())).thenReturn(false);

        LoginDTO dto = LoginDTO.builder().username("krishna.s").password("").build();

        assertThatThrownBy(() -> authService.login(dto)).isInstanceOf(UnauthorizedException.class);
    }

    @Test
    @DisplayName("an unknown username fails identically to a wrong password (no user enumeration)")
    void unknownUsernameAndWrongPassword_ShouldBeIndistinguishable() {
        // This is the security-relevant assertion, not just a duplicate of the test above. The
        // ORIGINAL threw ResourceNotFoundException ("User not found with username: X") -> HTTP 404
        // for an unknown user, versus a different outcome for a known one. That difference is a
        // free username oracle: an attacker sprays candidate usernames and reads the status code
        // to learn which accounts exist, then focuses password guessing on those.
        when(userRepository.findByUsername("does.not.exist")).thenReturn(Optional.empty());

        Throwable unknownUser = org.junit.jupiter.api.Assertions.assertThrows(
                UnauthorizedException.class,
                () -> authService.login(LoginDTO.builder().username("does.not.exist").password("anything").build()));

        reset(userRepository);
        when(userRepository.findByUsername("krishna.s")).thenReturn(Optional.of(adminUser()));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        Throwable badPassword = org.junit.jupiter.api.Assertions.assertThrows(
                UnauthorizedException.class,
                () -> authService.login(LoginDTO.builder().username("krishna.s").password("anything").build()));

        assertThat(unknownUser.getClass()).isEqualTo(badPassword.getClass());
        assertThat(unknownUser.getMessage())
                .as("both failure modes must be byte-identical to the caller")
                .isEqualTo(badPassword.getMessage());
    }

    @Test
    @DisplayName("correct credentials issue a token and return the user profile")
    void validCredentials_ShouldIssueToken() {
        when(userRepository.findByUsername("krishna.s")).thenReturn(Optional.of(adminUser()));
        when(passwordEncoder.matches(eq("correct-password"), anyString())).thenReturn(true);
        when(jwtService.issueToken(1L, "krishna.s", "ROLE_ADMIN")).thenReturn("header.payload.signature");

        LoginDTO dto = LoginDTO.builder().username("krishna.s").password("correct-password").build();
        LoginResponseDTO response = authService.login(dto);

        // The token field did not exist on the original LoginResponseDTO at all, so there was
        // nothing for the frontend to present on any subsequent request.
        assertThat(response.getToken()).isEqualTo("header.payload.signature");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("krishna.s");
        assertThat(response.getRoleName()).isEqualTo("ROLE_ADMIN");
        assertThat(response.getDepartmentName()).isEqualTo("Ground Handling");
    }

    @Test
    @DisplayName("the raw password hash never leaks into the response")
    void response_ShouldNotExposePasswordHash() {
        when(userRepository.findByUsername("krishna.s")).thenReturn(Optional.of(adminUser()));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.issueToken(any(), anyString(), anyString())).thenReturn("token");

        LoginResponseDTO response = authService.login(
                LoginDTO.builder().username("krishna.s").password("correct-password").build());

        // LoginResponseDTO has no password field, so this is really a guard against someone
        // "helpfully" adding one later -- toString() is what would end up in a log line.
        assertThat(response.toString()).doesNotContain("$2a$");
    }

    @Test
    @DisplayName("a user with no role still authenticates (roleName passed through as null)")
    void userWithoutRole_ShouldStillAuthenticate() {
        User noRole = User.builder()
                .userId(9L).username("temp.contractor").name("Temp Contractor")
                .passwordHash("$2a$10$hash").role(null).department(null)
                .build();

        when(userRepository.findByUsername("temp.contractor")).thenReturn(Optional.of(noRole));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.issueToken(9L, "temp.contractor", null)).thenReturn("token");

        LoginResponseDTO response = authService.login(
                LoginDTO.builder().username("temp.contractor").password("pw").build());

        assertThat(response.getRoleName()).isNull();
        assertThat(response.getToken()).isEqualTo("token");
    }
}
