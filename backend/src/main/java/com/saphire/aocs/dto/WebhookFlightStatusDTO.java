package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookFlightStatusDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotBlank(message = "Status is required")
    private String status;
}
