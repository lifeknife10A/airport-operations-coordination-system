package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "flights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "flight_number", length = 10, nullable = false)
    private String flightNumber;

    @Column(name = "flight_status", length = 20, nullable = false)
    private String flightStatus; // SCHEDULED, BOARDING, AIRBORNE, LANDED, DELAYED, CANCELLED

    @Column(name = "flight_type", length = 15, nullable = false)
    private String flightType; // ARRIVAL, DEPARTURE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_airport_id", nullable = false)
    private Airport originAirport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_airport_id", nullable = false)
    private Airport destinationAirport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gate_id")
    private Gate gate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stand_id")
    private Stand stand;

    @Column(name = "scheduled_departure_time", nullable = false)
    private ZonedDateTime scheduledDepartureTime;

    @Column(name = "estimated_departure_time")
    private ZonedDateTime estimatedDepartureTime;

    @Column(name = "actual_departure_time")
    private ZonedDateTime actualDepartureTime;

    @Column(name = "scheduled_arrival_time", nullable = false)
    private ZonedDateTime scheduledArrivalTime;

    @Column(name = "estimated_arrival_time")
    private ZonedDateTime estimatedArrivalTime;

    @Column(name = "actual_arrival_time")
    private ZonedDateTime actualArrivalTime;

    @Column(name = "boarding_time")
    private ZonedDateTime boardingTime;

    @Column(name = "runway_id")
    private Long runwayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "inbound_flight_id")
    private Long inboundFlightId;
}
