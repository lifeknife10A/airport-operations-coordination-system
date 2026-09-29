package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BagTagResponseDTO {
    private Long bagTagId;
    private String tagNumber;
    private BigDecimal weightKg;
    private String status;
    private Long passengerId;
    private Long flightId;
}
