package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightDTO {
    private Long flightId;
    private String flightNumber;
    private String flightStatus;
    private String flightType;
    
    private Long originAirportId;
    private String originAirportCode;
    private String originAirportName;
    
    private Long destinationAirportId;
    private String destinationAirportCode;
    private String destinationAirportName;
    
    private Long airlineId;
    private String airlineCode;
    private String airlineName;
    
    private Long aircraftId;
    private String aircraftRegistration;
    
    private Long gateId;
    private String gateNumber;
    
    private Long standId;
    private String standNumber;
    
    private ZonedDateTime scheduledDepartureTime;
    private ZonedDateTime estimatedDepartureTime;
    private ZonedDateTime actualDepartureTime;
    
    private ZonedDateTime scheduledArrivalTime;
    private ZonedDateTime estimatedArrivalTime;
    private ZonedDateTime actualArrivalTime;
    
    private ZonedDateTime boardingTime;
    private Long runwayId;
    
    private Long departmentId;
    private String departmentName;
    
    private Long inboundFlightId;
}
