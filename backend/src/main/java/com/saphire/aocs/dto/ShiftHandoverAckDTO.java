package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverAckDTO {

    @NotNull(message = "Incoming supervisor ID is required")
    private Long incomingSupervisorId;

    private String acknowledgementNotes;
}
