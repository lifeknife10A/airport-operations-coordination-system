package com.saphire.aocs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.GateAssignmentDTO;
import com.saphire.aocs.dto.GateResponseDTO;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.service.GateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class GateControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GateService gateService;

    @InjectMocks
    private GateController gateController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(gateController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getAllGates_ShouldReturnGateList() throws Exception {
        GateResponseDTO gate = GateResponseDTO.builder()
                .gateId(1L)
                .gateNumber("A1")
                .stands(Collections.emptyList())
                .activeFlights(Collections.emptyList())
                .build();

        when(gateService.getAllGates()).thenReturn(List.of(gate));

        mockMvc.perform(get("/api/gates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].gateId").value(1))
                .andExpect(jsonPath("$[0].gateNumber").value("A1"));
    }

    @Test
    void assignGateToFlight_ShouldReturnUpdatedFlight() throws Exception {
        GateAssignmentDTO dto = GateAssignmentDTO.builder()
                .flightId(101L)
                .gateId(1L)
                .build();

        FlightDTO updated = FlightDTO.builder()
                .flightId(101L)
                .gateId(1L)
                .gateNumber("A1")
                .build();

        when(gateService.assignGateToFlight(any(GateAssignmentDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/gates/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("A1"));
    }
}
