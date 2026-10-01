package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverCreateDTO {

    @NotBlank(message = "Shift code is required")
    @Size(max = 20, message = "Shift code must be at most 20 characters")
    private String shiftCode;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Outgoing supervisor ID is required")
    private Long outgoingSupervisorId;

    @NotNull(message = "Incoming supervisor ID is required")
    private Long incomingSupervisorId;

    @PositiveOrZero(message = "Total flights handled must be zero or positive")
    private Integer totalFlightsHandled;

    @PositiveOrZero(message = "Delayed flights count must be zero or positive")
    private Integer delayedFlightsCount;

    @PositiveOrZero(message = "Average turnaround minutes must be zero or positive")
    private BigDecimal averageTurnaroundMinutes;

    @PositiveOrZero(message = "Ground incidents count must be zero or positive")
    private Integer groundIncidentsCount;

    @NotBlank(message = "Critical events summary is required")
    private String criticalEventsSummary;

    private String unresolvedEquipmentIssues;
    private String pendingFlightWatches;
    private String safetyWeatherAdvisories;
}
