package com.saphire.aocs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saphire.aocs.dto.LoginDTO;
import com.saphire.aocs.dto.LoginResponseDTO;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.service.AuthService;
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
}
