package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airport_id")
    private Long airportId;

    @Column(name = "iata_code", length = 10, nullable = false, unique = true)
    private String iataCode;

    @Column(name = "icao_code", length = 10, nullable = false, unique = true)
    private String icaoCode;

    @Column(name = "airport_name", length = 100, nullable = false)
    private String airportName;

    @Column(name = "city", length = 50, nullable = false)
    private String city;

    @Column(name = "country", length = 50, nullable = false)
    private String country;

    @Column(name = "timezone", length = 50, nullable = false)
    private String timezone;
}
