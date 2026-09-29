package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverAckDTO {
    private Long incomingSupervisorId;
    private String acknowledgementNotes;
}
