package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueBoardingPassDTO {
    private Long passengerId;
    private String seatNumber;
    private String cabinClass; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    private String frequentFlyerNumber;
}
