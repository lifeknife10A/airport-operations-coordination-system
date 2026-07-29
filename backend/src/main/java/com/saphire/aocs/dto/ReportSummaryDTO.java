package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSummaryDTO {
    private long totalFlights;
    private long landedFlights;
    private long delayedFlights;
    private double onTimeDepartureRate;
    private long totalTasksCompleted;
    private long pendingTasks;
}
