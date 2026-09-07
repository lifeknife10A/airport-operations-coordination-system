package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bag_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BagTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bag_tag_id")
    private Long bagTagId;

    @Column(name = "tag_number", length = 20, nullable = false, unique = true)
    private String tagNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "weight_kg", precision = 5, scale = 2, nullable = false)
    private BigDecimal weightKg;

    @Column(name = "status", length = 20, nullable = false)
    private String status;
}
