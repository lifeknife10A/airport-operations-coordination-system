package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "runways")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Runway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "runway_id")
    private Long runwayId;

    @Column(name = "runway_code", length = 20, nullable = false, unique = true)
    private String runwayCode;

    @Column(name = "operational_status", length = 30)
    @Builder.Default
    private String operationalStatus = "ACTIVE_CAT_III";

    @Column(name = "surface_friction", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal surfaceFriction = new BigDecimal("0.84");

    @Column(name = "active_ils_frequency", length = 20)
    @Builder.Default
    private String activeIlsFrequency = "110.30 MHz";

    @Column(name = "visual_range_meters")
    @Builder.Default
    private Integer visualRangeMeters = 2000;
}
