package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "operational_inquiries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperationalInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Long inquiryId;

    @Column(name = "ticket_number", length = 30, nullable = false, unique = true)
    private String ticketNumber;

    @Column(name = "full_name", length = 150, nullable = false)
    private String fullName;

    @Column(name = "email_address", length = 150, nullable = false)
    private String emailAddress;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "inquiry_details", columnDefinition = "TEXT", nullable = false)
    private String inquiryDetails;

    @Column(name = "priority", length = 20, nullable = false)
    @Builder.Default
    private String priority = "NORMAL";

    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private String status = "OPEN";

    @Column(name = "source_channel", length = 30, nullable = false)
    @Builder.Default
    private String sourceChannel = "WEB_PORTAL";

    @Column(name = "assigned_department", length = 50)
    private String assignedDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_user_id")
    private User assignedStaffUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_flight_id")
    private Flight linkedFlight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_traveler_id")
    private Traveler linkedTraveler;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
