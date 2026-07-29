package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnaroundTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @Column(name = "task_name", length = 100, nullable = false)
    private String taskName; // CLEANING, REFUELING, MAINTENANCE, CATERING, BOARDING, SECURITY

    @Column(name = "status", length = 20, nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, BLOCKED

    @Column(name = "scheduled_start")
    private ZonedDateTime scheduledStart;

    @Column(name = "scheduled_end")
    private ZonedDateTime scheduledEnd;

    @Column(name = "actual_start")
    private ZonedDateTime actualStart;

    @Column(name = "actual_end")
    private ZonedDateTime actualEnd;

    @Column(name = "notes")
    private String notes;
}
