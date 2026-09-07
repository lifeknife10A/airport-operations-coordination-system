package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passengers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "traveler_id", nullable = false)
    private Traveler traveler;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "pnr_code", length = 10, nullable = false)
    private String pnrCode;

    @Column(name = "is_transit_passenger", nullable = false)
    private Boolean isTransitPassenger;
}
