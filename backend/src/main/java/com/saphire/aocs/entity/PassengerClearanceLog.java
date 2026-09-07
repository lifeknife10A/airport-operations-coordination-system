package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "passenger_clearance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerClearanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clearance_id")
    private Long clearanceId;

    @Column(name = "scan_timestamp", nullable = false)
    private ZonedDateTime scanTimestamp;

    @Column(name = "clearance_status", length = 25, nullable = false)
    private String clearanceStatus;

    @Column(name = "denial_reason", length = 100)
    private String denialReason;

    @Column(name = "verification_method", length = 30, nullable = false)
    private String verificationMethod;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @Column(name = "boarding_pass_id")
    private Long boardingPassId;

    @Column(name = "checkpoint_id")
    private Long checkpointId;
}
