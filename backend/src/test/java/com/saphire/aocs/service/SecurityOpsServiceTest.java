package com.saphire.aocs.service;

import com.saphire.aocs.dto.SecurityOps.ClearanceCreate;
import com.saphire.aocs.dto.SecurityOps.IncidentCreate;
import com.saphire.aocs.dto.SecurityOps.LoungeVisitCreate;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SecurityOpsServiceTest {

    @Mock private JdbcTemplate jdbc;
    @Mock private UserRepository userRepository;

    @InjectMocks private SecurityOpsService service;

    @Test
    @DisplayName("a denial without a reason is rejected before anything is written")
    void denialNeedsReason() {
        assertThatThrownBy(() -> service.logClearance(new ClearanceCreate(1L, "DENIED", "BIOMETRIC_FACIAL", 4L, "  ")))
                .isInstanceOf(BadRequestException.class);
        verifyNoInteractions(jdbc);
    }

    @Test
    @DisplayName("a passenger with no boarding pass cannot be scanned")
    void noBoardingPass_is404() {
        when(jdbc.queryForObject(anyString(), eq(Long.class), eq(1L))).thenThrow(new EmptyResultDataAccessException(1));

        assertThatThrownBy(() -> service.logClearance(new ClearanceCreate(1L, "APPROVED", "BIOMETRIC_FACIAL", 4L, null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("boarding pass");
    }

    @Test
    @DisplayName("an unknown checkpoint is a 404")
    void unknownCheckpoint_is404() {
        when(jdbc.queryForObject(anyString(), eq(Long.class), eq(1L))).thenReturn(55L);
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(99L))).thenReturn(0);

        assertThatThrownBy(() -> service.logClearance(new ClearanceCreate(1L, "APPROVED", "BIOMETRIC_FACIAL", 99L, null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Checkpoint");
    }

    @Test
    @DisplayName("an incident for an unknown flight is a 404")
    void incidentUnknownFlight_is404() {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(7L))).thenReturn(0);

        assertThatThrownBy(() -> service.createIncident(new IncidentCreate("t", "l", "LOW", null, 7L), "officer"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("a lounge visit to a lounge that does not exist is a 400")
    void unknownLounge_is400() {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq("Nope"))).thenReturn(0);

        assertThatThrownBy(() -> service.logLoungeVisit(new LoungeVisitCreate("Nope", 1L))).isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("updating an incident for an unknown user is a 404 and nothing is updated")
    void incidentStatus_unknownUser() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateIncidentStatus(1L, "RESOLVED", "ghost")).isInstanceOf(ResourceNotFoundException.class);
        verify(jdbc, never()).update(anyString(), any(Object[].class));
    }
}
