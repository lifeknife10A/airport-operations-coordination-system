package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunwayStatusUpdateDTO {
    private String operationalStatus;
    private BigDecimal surfaceFriction;
    private Integer visualRangeMeters;
}
