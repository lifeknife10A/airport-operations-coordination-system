package com.saphire.aocs.service;

import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogisticsServiceTest {

    @Mock private JdbcTemplate jdbc;
    @InjectMocks private LogisticsService service;

    private void carouselExists(boolean exists) {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(3L))).thenReturn(exists ? 1 : 0);
    }

    @Test
    @DisplayName("an unknown carousel is a 404")
    void unknownCarousel() {
        carouselExists(false);
        assertThatThrownBy(() -> service.assignCarousel(3L, 10L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("an unknown flight is a 404")
    void unknownFlight() {
        carouselExists(true);
        when(jdbc.queryForList(anyString(), eq(String.class), eq(10L))).thenReturn(List.of());
        assertThatThrownBy(() -> service.assignCarousel(3L, 10L)).isInstanceOf(ResourceNotFoundException.class);
        verify(jdbc, never()).update(anyString(), any(Object[].class));
    }

    @Test
    @DisplayName("a departed or cancelled flight cannot be given a carousel")
    void inactiveFlight() {
        carouselExists(true);
        when(jdbc.queryForList(anyString(), eq(String.class), eq(10L))).thenReturn(List.of("CANCELLED"));
        assertThatThrownBy(() -> service.assignCarousel(3L, 10L)).isInstanceOf(ConflictException.class).hasMessageContaining("cancelled");
    }

    @Test
    @DisplayName("a flight already on another carousel is a 409 naming that carousel")
    void flightAlreadyOnCarousel() {
        carouselExists(true);
        when(jdbc.queryForList(anyString(), eq(String.class), eq(10L))).thenReturn(List.of("SCHEDULED"));
        when(jdbc.queryForList(anyString(), eq(String.class), eq(10L), eq(3L))).thenReturn(List.of("BELT-007"));
        assertThatThrownBy(() -> service.assignCarousel(3L, 10L)).isInstanceOf(ConflictException.class).hasMessageContaining("BELT-007");
        verify(jdbc, never()).update(anyString(), any(Object[].class));
    }
}
