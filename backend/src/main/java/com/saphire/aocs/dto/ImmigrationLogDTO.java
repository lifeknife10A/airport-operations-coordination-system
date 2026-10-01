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
public class ImmigrationLogDTO {

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;

    @NotBlank(message = "Visa type is required")
    @Size(max = 30, message = "Visa type must be at most 30 characters")
    private String visaType;

    @NotBlank(message = "Stamp number is required")
    @Size(max = 50, message = "Stamp number must be at most 50 characters")
    private String stampNumber;

    @NotNull(message = "Biometric facial match result is required")
    private Boolean biometricFacialMatched;

    @Pattern(regexp = "DEPARTURE_EMIGRATION|ARRIVAL_IMMIGRATION", message = "Unknown clearance type")
    private String clearanceType;
}
