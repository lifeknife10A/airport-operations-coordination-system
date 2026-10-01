package com.saphire.aocs.dto;

import lombok.*;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinLookupDTO {
    private Long passengerId;
    private String pnrCode;
    private Long travelerId;
    private String travelerName;
    private String passportNumber;
    private String nationality;
    private Boolean isTransitPassenger;
    
    // Flight details
    private Long flightId;
    private String flightNumber;
    private String airlineName;
    private String originIata;
    private String destinationIata;
    private String departureGate;
    private String stand;
    private ZonedDateTime scheduledDeparture;
    private String flightStatus;
    
    // Boarding Pass & Seat details if already issued
    private Boolean isCheckedIn;
    private String seatNumber;
    private String cabinClass;
    private String boardingGroup;
    private Integer sequenceNumber;
    private String ticketNumber;
    private String barcodeData;
    
    // Baggage details
    private List<BagTagResponseDTO> baggageTags;
}
