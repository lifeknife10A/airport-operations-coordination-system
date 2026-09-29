package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagBaggageRequestDTO {
    private Long passengerId;
    private Long flightId;
    private BigDecimal weightKg;
    private String scannerLocation; // e.g. "CHECKIN_DESK_C12"
}
