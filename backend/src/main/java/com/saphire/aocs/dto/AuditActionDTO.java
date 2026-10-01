package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditActionDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Action is required")
    @Size(max = 255, message = "Action must be at most 255 characters")
    private String action;

    @Size(max = 5000, message = "Change payload must be at most 5000 characters")
    private String changePayload;
}
