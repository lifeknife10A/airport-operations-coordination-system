package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "shift_handover_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftHandoverLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "handover_id")
    private Long handoverId;

    @Column(name = "shift_code", length = 20, nullable = false)
    private String shiftCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outgoing_supervisor_id", nullable = false)
    private User outgoingSupervisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incoming_supervisor_id", nullable = false)
    private User incomingSupervisor;

    @Column(name = "total_flights_handled", nullable = false)
    @Builder.Default
    private Integer totalFlightsHandled = 0;

    @Column(name = "delayed_flights_count", nullable = false)
    @Builder.Default
    private Integer delayedFlightsCount = 0;

    @Column(name = "average_turnaround_minutes", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal averageTurnaroundMinutes = new BigDecimal("45.00");

    @Column(name = "ground_incidents_count", nullable = false)
    @Builder.Default
    private Integer groundIncidentsCount = 0;

    @Column(name = "critical_events_summary", columnDefinition = "TEXT", nullable = false)
    private String criticalEventsSummary;

    @Column(name = "unresolved_equipment_issues", columnDefinition = "TEXT")
    private String unresolvedEquipmentIssues;

    @Column(name = "pending_flight_watches", columnDefinition = "TEXT")
    private String pendingFlightWatches;

    @Column(name = "safety_weather_advisories", columnDefinition = "TEXT")
    private String safetyWeatherAdvisories;

    @CreationTimestamp
    @Column(name = "outgoing_signoff_timestamp", nullable = false)
    private OffsetDateTime outgoingSignoffTimestamp;

    @Column(name = "incoming_signoff_timestamp")
    private OffsetDateTime incomingSignoffTimestamp;

    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private String status = "PENDING_ACKNOWLEDGEMENT";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
