package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "boarding_passes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardingPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "boarding_pass_id")
    private Long boardingPassId;

    @Column(name = "barcode_data", length = 255, nullable = false, unique = true)
    private String barcodeData;

    @Column(name = "ticket_number", length = 30, nullable = false, unique = true)
    private String ticketNumber;

    @Column(name = "seat_number", length = 10, nullable = false)
    private String seatNumber;

    @Column(name = "cabin_class", length = 20, nullable = false)
    private String cabinClass;

    @Column(name = "boarding_group", length = 10, nullable = false)
    @Builder.Default
    private String boardingGroup = "ZONE 1";

    @Column(name = "sequence_number", nullable = false)
    private Integer sequenceNumber;

    @Column(name = "frequent_flyer_number", length = 30)
    private String frequentFlyerNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
}
