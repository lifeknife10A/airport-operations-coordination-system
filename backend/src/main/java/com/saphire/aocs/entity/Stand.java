package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stands")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stand_id")
    private Long standId;

    @Column(name = "stand_number", length = 20, nullable = false, unique = true)
    private String standNumber;

    @Column(name = "is_remote", nullable = false)
    private Boolean isRemote;

    @Column(name = "has_jetbridge", nullable = false)
    private Boolean hasJetbridge;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_gate_id")
    private Gate assignedGate;
}
