package com.saphire.aocs.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagBaggageRequestDTO {

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be greater than zero")
    private BigDecimal weightKg;

    @NotBlank(message = "Scanner location is required")
    @Size(max = 100, message = "Scanner location must be at most 100 characters")
    private String scannerLocation;
}
