package com.saphire.aocs.dto;

import com.saphire.aocs.entity.BagTag;
import com.saphire.aocs.entity.BaggageScanEvent;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * A bag and its scan history, with only what baggage staff need. The entities these come from
 * link to the passenger's traveler record, so returning them directly exposed passport numbers,
 * emails and phone numbers to every role allowed to track a bag.
 */
@Data
@Builder
public class BagTrackingDTO {
    private String tagNumber;
    private String status;
    private BigDecimal weightKg;
    private String passengerName;
    private String flightNumber;
    private List<ScanEvent> scanEvents;

    @Data
    @Builder
    public static class ScanEvent {
        private Long scanId;
        private String location;
        private ZonedDateTime timestamp;

        public static ScanEvent from(BaggageScanEvent e) {
            return ScanEvent.builder().scanId(e.getScanId()).location(e.getScanLocation()).timestamp(e.getScanTimestamp()).build();
        }
    }

    public static String passengerName(BagTag bag) {
        if (bag == null || bag.getPassenger() == null || bag.getPassenger().getTraveler() == null) return null;
        var t = bag.getPassenger().getTraveler();
        return (t.getFirstName() + " " + t.getLastName()).trim();
    }

    public static BagTrackingDTO from(BagTag bag, List<BaggageScanEvent> scans) {
        return BagTrackingDTO.builder()
                .tagNumber(bag.getTagNumber())
                .status(bag.getStatus())
                .weightKg(bag.getWeightKg())
                .passengerName(passengerName(bag))
                .flightNumber(bag.getFlight() != null ? bag.getFlight().getFlightNumber() : null)
                .scanEvents(scans.stream().map(ScanEvent::from).toList())
                .build();
    }
}
