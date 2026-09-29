package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.ZonedDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Column(name = "action", length = 255, nullable = false)
    private String action;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    // Without @JdbcTypeCode Hibernate binds this as varchar and Postgres refuses to insert it into
    // the jsonb column ("column change_payload is of type jsonb but expression is of type
    // character varying"), so every audit write threw a 500.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "change_payload", columnDefinition = "jsonb")
    private String changePayload;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private ZonedDateTime createdAt;
}
