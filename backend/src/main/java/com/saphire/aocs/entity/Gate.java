package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gate_id")
    private Long gateId;

    @Column(name = "gate_number", length = 10, nullable = false, unique = true)
    private String gateNumber;

    @Column(name = "concourse", length = 30)
    private String concourse;

    @Column(name = "terminal", length = 50)
    private String terminal;

    @Column(name = "max_wingspan_meters")
    private Double maxWingspanMeters;
}
