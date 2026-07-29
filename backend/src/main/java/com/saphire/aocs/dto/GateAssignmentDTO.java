package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GateAssignmentDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Gate ID is required")
    private Long gateId;

    private Long standId;
}
