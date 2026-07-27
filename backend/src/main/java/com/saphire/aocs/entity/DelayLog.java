package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "delay_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DelayLog {

    @EmbeddedId
    private DelayLogId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("flightId")
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "delay_code", length = 10, nullable = false)
    private String delayCode;

    @Column(name = "delay_minutes", nullable = false)
    private Integer delayMinutes;
}
