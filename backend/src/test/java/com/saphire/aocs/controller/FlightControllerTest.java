package com.saphire.aocs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saphire.aocs.dto.FlightCreateDTO;
import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.ZonedDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class FlightControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FlightService flightService;

    @InjectMocks
    private FlightController flightController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(flightController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getAllSaphireHubFlights_ShouldReturnList() throws Exception {
        FlightDTO flight = FlightDTO.builder()
                .flightId(101L)
                .flightNumber("SPH-101")
                .flightStatus("SCHEDULED")
                .originAirportId(1L)
                .originAirportCode("SPH")
                .destinationAirportId(2L)
                .destinationAirportCode("DXB")
                .build();

        when(flightService.getSaphireHubFlights()).thenReturn(List.of(flight));

        mockMvc.perform(get("/api/flights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].flightId").value(101))
                .andExpect(jsonPath("$[0].flightNumber").value("SPH-101"))
                .andExpect(jsonPath("$[0].originAirportCode").value("SPH"));
    }

    @Test
    void getFlightById_WhenFound_ShouldReturnFlight() throws Exception {
        FlightDTO flight = FlightDTO.builder()
                .flightId(101L)
                .flightNumber("SPH-101")
                .build();

        when(flightService.getFlightById(101L)).thenReturn(flight);

        mockMvc.perform(get("/api/flights/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightId").value(101))
                .andExpect(jsonPath("$.flightNumber").value("SPH-101"));
    }

    @Test
    void getFlightById_WhenNotFound_ShouldReturn404() throws Exception {
        when(flightService.getFlightById(999L)).thenThrow(new ResourceNotFoundException("Flight not found"));

        mockMvc.perform(get("/api/flights/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void updateFlightStatus_ShouldReturnUpdatedFlight() throws Exception {
        StatusUpdateDTO dto = StatusUpdateDTO.builder()
                .status("LANDED")
                .build();

        FlightDTO updated = FlightDTO.builder()
                .flightId(101L)
                .flightStatus("LANDED")
                .build();

        when(flightService.updateFlightStatus(eq(101L), eq("LANDED"))).thenReturn(updated);

        mockMvc.perform(put("/api/flights/101/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightStatus").value("LANDED"));
    }
}
