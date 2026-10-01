package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checkin_counters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinCounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "counter_id")
    private Long counterId;

    @Column(name = "counter_number", length = 20, nullable = false, unique = true)
    private String counterNumber;

    @Column(name = "terminal", length = 10, nullable = false)
    private String terminal;

    @Column(name = "concourse", length = 30)
    private String concourse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "allocated_airline_id")
    private Airline allocatedAirline;
}
