package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookDelayAlertDTO {

    @NotBlank(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Delay reason is required")
    private String delayReason;
}
