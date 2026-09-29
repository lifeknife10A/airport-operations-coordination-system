package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunwayTelemetryDTO {
    private Long runwayId;
    private String runwayCode;
    private String operationalStatus;
    private BigDecimal surfaceFriction;
    private String activeIlsFrequency;
    private Integer visualRangeMeters;
    private Integer activeDeparturesCount;
    private Integer activeArrivalsCount;
    private String crosswindVector;
    private String headwindVector;
    private String weatherCondition;
}
