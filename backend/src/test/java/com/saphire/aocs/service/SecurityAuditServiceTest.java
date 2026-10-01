package com.saphire.aocs.service;

import com.saphire.aocs.entity.AuditLog;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.AuditLogRepository;
import com.saphire.aocs.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * audit_logs.change_payload is jsonb, but the frontend sends free-text descriptions. Postgres
 * rejects non-JSON text for a jsonb column, which used to turn every audit write into a 500.
 */
@ExtendWith(MockitoExtension.class)
class SecurityAuditServiceTest {

    @Mock private AuditLogRepository auditLogRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private SecurityAuditService service;

    private String savedPayload(String input) {
        when(userRepository.findById(1L)).thenReturn(Optional.of(User.builder().userId(1L).build()));
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(inv -> inv.getArgument(0));

        service.logAction(1L, "TEST", input);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        return captor.getValue().getChangePayload();
    }

    @Test
    @DisplayName("free text is wrapped as a JSON object so the jsonb column accepts it")
    void freeText_IsWrappedAsJsonDetails() {
        assertThat(savedPayload("Gate A12 assigned to flight AI-203"))
                .isEqualTo("{\"details\":\"Gate A12 assigned to flight AI-203\"}");
    }

    @Test
    @DisplayName("text containing quotes is escaped, not spliced into the JSON")
    void textWithQuotes_IsEscaped() {
        assertThat(savedPayload("said \"hold\" at gate"))
                .isEqualTo("{\"details\":\"said \\\"hold\\\" at gate\"}");
    }

    @Test
    @DisplayName("a payload that is already a JSON object passes through untouched")
    void jsonObject_PassesThrough() {
        assertThat(savedPayload("{\"gate\":\"A12\",\"old\":\"B4\"}")).isEqualTo("{\"gate\":\"A12\",\"old\":\"B4\"}");
    }

    @Test
    @DisplayName("a bare number or word is not left as a JSON scalar")
    void bareScalar_IsWrapped() {
        assertThat(savedPayload("123")).isEqualTo("{\"details\":\"123\"}");
    }

    @Test
    @DisplayName("a null or blank payload is stored as null")
    void blank_IsNull() {
        assertThat(savedPayload(null)).isNull();
    }

    @Test
    @DisplayName("an unknown user is a 404, not a database error")
    void unknownUser_ThrowsNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.logAction(99L, "X", "y")).isInstanceOf(ResourceNotFoundException.class);
    }
}
