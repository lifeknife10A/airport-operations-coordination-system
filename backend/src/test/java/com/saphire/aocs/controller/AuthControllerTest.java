package com.saphire.aocs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saphire.aocs.dto.LoginDTO;
import com.saphire.aocs.dto.LoginResponseDTO;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.exception.TooManyRequestsException;
import com.saphire.aocs.exception.UnauthorizedException;
import com.saphire.aocs.service.AuthService;
import com.saphire.aocs.service.LoginAttemptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private LoginAttemptService loginAttempts;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void login_ShouldReturnUserResponse() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .username("admin")
                .password("password")
                .build();

        LoginResponseDTO responseDTO = LoginResponseDTO.builder()
                .userId(1L)
                .username("admin")
                .name("Admin User")
                .roleName("SUPERVISOR")
                .departmentName("OPERATIONS")
                .build();

        when(authService.login(any(LoginDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.roleName").value("SUPERVISOR"));
    }

    @Test
    void login_WhenLockedOut_ShouldReturn429WithRetryAfter() throws Exception {
        org.mockito.Mockito.doThrow(new TooManyRequestsException("Too many failed login attempts.", 600))
                .when(loginAttempts).assertNotLocked(any(), any());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(LoginDTO.builder().username("admin").password("pw").build())))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "600"));

        // A locked-out caller must never reach the real authentication check.
        org.mockito.Mockito.verifyNoInteractions(authService);
    }

    @Test
    void login_WhenCredentialsWrong_ShouldRecordTheFailure() throws Exception {
        when(authService.login(any(LoginDTO.class))).thenThrow(new UnauthorizedException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(LoginDTO.builder().username("admin").password("bad").build())))
                .andExpect(status().isUnauthorized());

        org.mockito.Mockito.verify(loginAttempts).recordFailure(org.mockito.ArgumentMatchers.eq("admin"), any());
        org.mockito.Mockito.verify(loginAttempts, org.mockito.Mockito.never()).recordSuccess(any());
    }
}
