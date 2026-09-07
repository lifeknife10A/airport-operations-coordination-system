package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "baggage_scan_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaggageScanEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scan_id")
    private Long scanId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bag_tag_id", nullable = false)
    private BagTag bagTag;

    @Column(name = "scan_location", length = 100, nullable = false)
    private String scanLocation;

    @Column(name = "scan_timestamp", nullable = false)
    private ZonedDateTime scanTimestamp;
}
