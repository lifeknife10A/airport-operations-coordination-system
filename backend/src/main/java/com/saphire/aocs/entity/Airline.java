package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airlines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airline_id")
    private Long airlineId;

    @Column(name = "iata_code", length = 10, nullable = false, unique = true)
    private String iataCode;

    @Column(name = "icao_code", length = 10, nullable = false, unique = true)
    private String icaoCode;

    @Column(name = "airline_name", length = 100, nullable = false)
    private String airlineName;

    @Column(name = "country", length = 50, nullable = false)
    private String country;
}
