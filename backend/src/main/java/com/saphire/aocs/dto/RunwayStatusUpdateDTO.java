package com.saphire.aocs.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunwayStatusUpdateDTO {

    @Pattern(regexp = "ACTIVE_CAT_III|DEPARTURE_ONLY|ARRIVALS_ONLY|SWEEP_FOD_INSPECTION|CLOSED_MAINTENANCE",
             message = "Unknown operational status")
    private String operationalStatus;

    @DecimalMin(value = "0.00", message = "Surface friction must be between 0.00 and 1.00")
    @DecimalMax(value = "1.00", message = "Surface friction must be between 0.00 and 1.00")
    @Digits(integer = 1, fraction = 2)
    private BigDecimal surfaceFriction;

    @PositiveOrZero(message = "Visual range must be zero or positive")
    private Integer visualRangeMeters;
}
