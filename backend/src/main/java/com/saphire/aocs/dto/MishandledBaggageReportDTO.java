package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MishandledBaggageReportDTO {

    @NotBlank(message = "Claim number is required")
    @Size(max = 50, message = "Claim number must be at most 50 characters")
    private String claimNumber;

    @Pattern(regexp = "LOST|DAMAGED|DELAYED|PILFERED", message = "Unknown incident type")
    private String incidentType;

    @NotBlank(message = "Tag number is required")
    private String tagNumber;

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
}
