package com.saphire.aocs.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DelayCreateDTO {
    @NotBlank(message = "Delay code is required")
    private String delayCode;

    @NotNull(message = "Delay minutes is required")
    @Min(value = 1, message = "Delay must be at least 1 minute")
    @Max(value = 1440, message = "Delay cannot exceed 24 hours")
    private Integer delayMinutes;
}
