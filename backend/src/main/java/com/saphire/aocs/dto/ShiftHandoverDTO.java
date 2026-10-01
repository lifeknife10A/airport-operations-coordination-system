package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverDTO {
    private Long handoverId;
    private String shiftCode;
    private Long departmentId;
    private String departmentName;
    private Long outgoingSupervisorId;
    private String outgoingSupervisorName;
    private Long incomingSupervisorId;
    private String incomingSupervisorName;
    private Integer totalFlightsHandled;
    private Integer delayedFlightsCount;
    private BigDecimal averageTurnaroundMinutes;
    private Integer groundIncidentsCount;
    private String criticalEventsSummary;
    private String unresolvedEquipmentIssues;
    private String pendingFlightWatches;
    private String safetyWeatherAdvisories;
    private OffsetDateTime outgoingSignoffTimestamp;
    private OffsetDateTime incomingSignoffTimestamp;
    private String status;
    private OffsetDateTime createdAt;
}
