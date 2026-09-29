package com.saphire.aocs.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverCreateDTO {
    private String shiftCode;
    private Long departmentId;
    private Long outgoingSupervisorId;
    private Long incomingSupervisorId;
    private Integer totalFlightsHandled;
    private Integer delayedFlightsCount;
    private BigDecimal averageTurnaroundMinutes;
    private Integer groundIncidentsCount;
    private String criticalEventsSummary;
    private String unresolvedEquipmentIssues;
    private String pendingFlightWatches;
    private String safetyWeatherAdvisories;
}
