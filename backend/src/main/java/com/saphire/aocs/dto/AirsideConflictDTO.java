package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

/** One airside planning conflict, derived from the live flight/gate data rather than stored. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirsideConflictDTO {
    /** WINGSPAN_OVERSIZE or GATE_CONFLICT. */
    private String type;
    /** CRITICAL or WARNING. */
    private String severity;
    private Long flightId;
    private String flightNumber;
    private String gateNumber;
    private String otherFlightNumber;
    private Double aircraftWingspanMeters;
    private Double gateMaxWingspanMeters;
    private ZonedDateTime scheduledDeparture;
    private String title;
    private String description;
}
