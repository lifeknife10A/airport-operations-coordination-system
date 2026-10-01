package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardingPassResponseDTO {
    private Long boardingPassId;
    private String barcodeData;
    private String ticketNumber;
    private String seatNumber;
    private String cabinClass;
    private String boardingGroup;
    private Integer sequenceNumber;
    private String frequentFlyerNumber;
    private Long passengerId;
    private String passengerName;
    private String pnrCode;
    private Long flightId;
    private String flightNumber;
    private String originIata;
    private String destinationIata;
    private String departureGate;
    private String boardingTime;
    private String scheduledDeparture;
}
