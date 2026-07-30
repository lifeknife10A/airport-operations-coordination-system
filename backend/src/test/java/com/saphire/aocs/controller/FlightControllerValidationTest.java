package com.saphire.aocs.controller;

import com.saphire.aocs.dto.FlightDTO;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Negative-path controller tests -- the entire category the reviewed bundle was missing. Not one
 * of the four original test classes sent an invalid payload, an unparseable path variable, or a
 * missing required query parameter.
 *
 * The first test here is the headline regression test for review §2.3: it FAILS against the
 * original GlobalExceptionHandler (which returns 500 for every @Valid failure, because it has no
 * MethodArgumentNotValidException handler and falls through to @ExceptionHandler(Exception.class))
 * and PASSES against the refactored one.
 *
 * NOTE ON JSON FIXTURES: these tests use raw JSON strings rather than
 * objectMapper.writeValueAsString(dto). The original tests construct a bare `new ObjectMapper()`
 * with no JavaTimeModule registered -- which happens to work only because none of them ever
 * serialises a DTO containing a ZonedDateTime. The moment you write a test that POSTs a real
 * FlightCreateDTO through that mapper, its date fields serialise as nested objects rather than
 * ISO-8601 strings and deserialisation fails for reasons unrelated to what you're testing.
 * Either register JavaTimeModule on a shared test mapper, or use fixtures like these.
 */
@ExtendWith(MockitoExtension.class)
class FlightControllerValidationTest {

    private MockMvc mockMvc;

    @Mock private FlightService flightService;
    @InjectMocks private FlightController flightController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(flightController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST with a missing required field -> 400 with a fieldErrors map (was 500)")
    void createFlight_MissingRequiredField_ShouldReturn400() throws Exception {
        // flightNumber (@NotBlank) and aircraftId (@NotNull) are both absent.
        String payload = """
                {
                  "flightStatus": "SCHEDULED",
                  "flightType": "ARRIVAL",
                  "originAirportId": 2,
                  "destinationAirportId": 1,
                  "airlineId": 3,
                  "scheduledDepartureTime": "2026-08-01T10:00:00+05:30",
                  "scheduledArrivalTime": "2026-08-01T13:00:00+05:30"
                }
                """;

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.flightNumber").exists())
                .andExpect(jsonPath("$.fieldErrors.aircraftId").exists())
                .andExpect(jsonPath("$.correlationId").exists());

        // The request must never have reached the service layer.
        verify(flightService, never()).createFlight(any());
    }

    @Test
    @DisplayName("POST with a blank (whitespace-only) flightNumber -> 400")
    void createFlight_BlankFlightNumber_ShouldReturn400() throws Exception {
        // Exercises @NotBlank specifically rather than @NotNull -- "   " is present but empty,
        // which a naive null-check would wave through.
        String payload = """
                {
                  "flightNumber": "   ",
                  "flightStatus": "SCHEDULED",
                  "flightType": "ARRIVAL",
                  "originAirportId": 2,
                  "destinationAirportId": 1,
                  "airlineId": 3,
                  "aircraftId": 4,
                  "scheduledDepartureTime": "2026-08-01T10:00:00+05:30",
                  "scheduledArrivalTime": "2026-08-01T13:00:00+05:30"
                }
                """;

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.flightNumber").exists());
    }

    @Test
    @DisplayName("GET with a non-numeric path variable -> 400, not 500")
    void getFlightById_NonNumericId_ShouldReturn400() throws Exception {
        // Throws MethodArgumentTypeMismatchException, which the original handler had no case for.
        mockMvc.perform(get("/api/flights/not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        verify(flightService, never()).getFlightById(any());
    }

    @Test
    @DisplayName("PUT status with an empty status field -> 400")
    void updateStatus_BlankStatus_ShouldReturn400() throws Exception {
        mockMvc.perform(put("/api/flights/101/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.status").exists());

        verify(flightService, never()).updateFlightStatus(any(), any());
    }

    @Test
    @DisplayName("an illegal state transition surfaces as 409 Conflict")
    void updateStatus_IllegalTransition_ShouldReturn409() throws Exception {
        when(flightService.updateFlightStatus(eq(101L), eq("DEPARTED")))
                .thenThrow(new ConflictException("Cannot transition flight SPH101 (id=101) from SCHEDULED to DEPARTED"));

        mockMvc.perform(put("/api/flights/101/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"DEPARTED\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("SCHEDULED")));
    }

    @Test
    @DisplayName("404 responses carry an RFC 7807 body with a type URI")
    void getFlightById_NotFound_ShouldReturnProblemDetail() throws Exception {
        when(flightService.getFlightById(999L)).thenThrow(new ResourceNotFoundException("Flight not found with ID: 999"));

        mockMvc.perform(get("/api/flights/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.type").exists())
                .andExpect(jsonPath("$.instance").value("/api/flights/999"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("an unexpected server error returns a generic detail, never the raw exception message")
    void unexpectedError_ShouldNotLeakExceptionMessage() throws Exception {
        // Regression for the information-disclosure half of §2.3: the original returned
        // ex.getMessage() verbatim, which for a Postgres DataIntegrityViolationException embeds
        // real table, column and constraint names.
        when(flightService.getFlightById(500L))
                .thenThrow(new IllegalStateException("ERROR: relation \"flights_internal_audit\" does not exist"));

        mockMvc.perform(get("/api/flights/500"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.not(
                        org.hamcrest.Matchers.containsString("flights_internal_audit"))))
                .andExpect(jsonPath("$.correlationId").exists());
    }

    @Test
    @DisplayName("malformed JSON -> 400, not 500")
    void createFlight_MalformedJson_ShouldReturn400() throws Exception {
        // HttpMessageNotReadableException. Spring Boot 3's ResponseEntityExceptionHandler covers
        // this if GlobalExceptionHandler extends it; with the standalone @RestControllerAdvice
        // above it lands on the generic handler instead. If this test reports 500, that's the
        // signal to make GlobalExceptionHandler extend ResponseEntityExceptionHandler -- a
        // worthwhile follow-up, and the reason this case is called out explicitly rather than
        // left to be discovered in production.
        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"flightNumber\": \"SPH101\", "))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("a valid POST still returns 201 (the fix does not over-reject)")
    void createFlight_ValidPayload_ShouldReturn201() throws Exception {
        when(flightService.createFlight(any()))
                .thenReturn(FlightDTO.builder().flightId(101L).flightNumber("SPH101").flightStatus("SCHEDULED").build());

        String payload = """
                {
                  "flightNumber": "SPH101",
                  "flightStatus": "SCHEDULED",
                  "flightType": "ARRIVAL",
                  "originAirportId": 2,
                  "destinationAirportId": 1,
                  "airlineId": 3,
                  "aircraftId": 4,
                  "scheduledDepartureTime": "2026-08-01T10:00:00+05:30",
                  "scheduledArrivalTime": "2026-08-01T13:00:00+05:30"
                }
                """;

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.flightId").value(101));
    }
}
