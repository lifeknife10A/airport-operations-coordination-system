package com.saphire.aocs.dto;

import com.saphire.aocs.entity.MishandledBaggage;
import lombok.Builder;
import lombok.Data;

/** Mishandled-baggage report without the nested passenger/traveler records. */
@Data
@Builder
public class MishandledReportDTO {
    private Long reportId;
    private String claimNumber;
    private String incidentType;
    private String status;
    private String tagNumber;
    private String passengerName;
    private String flightNumber;

    public static MishandledReportDTO from(MishandledBaggage m) {
        return MishandledReportDTO.builder()
                .reportId(m.getReportId())
                .claimNumber(m.getClaimNumber())
                .incidentType(m.getIncidentType())
                .status(m.getStatus())
                .tagNumber(m.getBagTag() != null ? m.getBagTag().getTagNumber() : null)
                .passengerName(BagTrackingDTO.passengerName(m.getBagTag()))
                .flightNumber(m.getBagTag() != null && m.getBagTag().getFlight() != null ? m.getBagTag().getFlight().getFlightNumber() : null)
                .build();
    }
}
