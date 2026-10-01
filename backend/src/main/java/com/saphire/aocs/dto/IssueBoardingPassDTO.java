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
public class IssueBoardingPassDTO {

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;

    @NotBlank(message = "Seat number is required")
    @Size(max = 10, message = "Seat number must be at most 10 characters")
    private String seatNumber;

    @Pattern(regexp = "ECONOMY|PREMIUM_ECONOMY|BUSINESS|FIRST", message = "Unknown cabin class")
    private String cabinClass;

    @Size(max = 30, message = "Frequent flyer number must be at most 30 characters")
    private String frequentFlyerNumber;
}
