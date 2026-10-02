package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RunwayAssignmentDTO {
    @NotNull(message = "Runway ID is required")
    private Long runwayId;
}
