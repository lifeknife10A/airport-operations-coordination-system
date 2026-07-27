package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "aircraft_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AircraftType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Long typeId;

    @Column(name = "type_code", length = 20, nullable = false, unique = true)
    private String typeCode;

    @Column(name = "manufacturer", length = 50, nullable = false)
    private String manufacturer;

    @Column(name = "model_name", length = 50, nullable = false)
    private String modelName;

    @Column(name = "wingspan_meters", precision = 5, scale = 2, nullable = false)
    private BigDecimal wingspanMeters;

    @Column(name = "mtow_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal mtowKg;

    @Column(name = "max_passenger_capacity", nullable = false)
    private Integer maxPassengerCapacity;
}
