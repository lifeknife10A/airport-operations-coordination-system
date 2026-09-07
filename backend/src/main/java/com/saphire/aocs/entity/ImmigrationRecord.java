package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "immigration_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImmigrationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "immigration_id")
    private Long immigrationId;

    @Column(name = "visa_type", length = 30, nullable = false)
    private String visaType;

    @Column(name = "stamp_number", length = 50, nullable = false, unique = true)
    private String stampNumber;

    @Column(name = "biometric_facial_matched", nullable = false)
    private Boolean biometricFacialMatched;

    @Column(name = "clearance_type", length = 30, nullable = false)
    private String clearanceType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;
}
