package com.saphire.aocs.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatMapResponseDTO {
    private Long flightId;
    private String flightNumber;
    private String aircraftModel;
    private Integer totalCapacity;
    private Integer occupiedSeatsCount;
    private Integer availableSeatsCount;
    private List<String> occupiedSeats;
    private List<String> cabinTiers; // e.g. ["FIRST", "BUSINESS", "PREMIUM_ECONOMY", "ECONOMY"]
}
