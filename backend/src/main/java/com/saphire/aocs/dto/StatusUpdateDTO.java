package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateDTO {

    @NotBlank(message = "Status is required")
    private String status;

    private Long userId;
    private String notes;
}
