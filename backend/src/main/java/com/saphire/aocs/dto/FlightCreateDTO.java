package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightCreateDTO {

    @NotBlank(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Flight status is required")
    private String flightStatus; // e.g. SCHEDULED

    @NotBlank(message = "Flight type is required")
    private String flightType; // ARRIVAL, DEPARTURE

    @NotNull(message = "Origin airport ID is required")
    private Long originAirportId;

    @NotNull(message = "Destination airport ID is required")
    private Long destinationAirportId;

    @NotNull(message = "Airline ID is required")
    private Long airlineId;

    @NotNull(message = "Aircraft ID is required")
    private Long aircraftId;

    private Long gateId;
    private Long standId;

    @NotNull(message = "Scheduled departure time is required")
    private ZonedDateTime scheduledDepartureTime;

    @NotNull(message = "Scheduled arrival time is required")
    private ZonedDateTime scheduledArrivalTime;

    private ZonedDateTime estimatedDepartureTime;
    private ZonedDateTime estimatedArrivalTime;
    private ZonedDateTime boardingTime;
    private Long runwayId;
    private Long departmentId;
    private Long inboundFlightId;
}
