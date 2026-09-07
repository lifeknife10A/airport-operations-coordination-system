package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mishandled_baggage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MishandledBaggage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "claim_number", length = 50, nullable = false, unique = true)
    private String claimNumber;

    @Column(name = "incident_type", length = 30, nullable = false)
    private String incidentType;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bag_tag_id", nullable = false)
    private BagTag bagTag;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;
}
