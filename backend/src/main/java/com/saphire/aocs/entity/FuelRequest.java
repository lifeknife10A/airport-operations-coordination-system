package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;

@Entity
@Table(name = "fuel_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "target_volume_liters", nullable = false)
    private BigDecimal targetVolumeLiters;

    @Column(name = "actual_volume_liters")
    private BigDecimal actualVolumeLiters;

    @Column(name = "target_weight_kg", nullable = false)
    private BigDecimal targetWeightKg;

    @Column(name = "actual_weight_kg")
    private BigDecimal actualWeightKg;

    @Column(name = "variance_percentage")
    private BigDecimal variancePercentage; // Validated within +-1% per NFR 3.11

    @Column(name = "safety_pin_verified", nullable = false)
    private Boolean safetyPinVerified;

    @Column(name = "status", length = 30, nullable = false)
    private String status; // REQUESTED, APPROVED, IN_PROGRESS, COMPLETED, REJECTED

    @Column(name = "requested_at", nullable = false)
    private ZonedDateTime requestedAt;

    @Column(name = "completed_at")
    private ZonedDateTime completedAt;

    /**
     * Self-enforcing ORM-level validation for NFR 3.11 (+-1% fuel variance bounds).
     * Throws IllegalArgumentException to abort persistence transaction if variance > 1.0%.
     */
    @PrePersist
    @PreUpdate
    public void calculateAndValidateVariance() {
        if (targetWeightKg != null && actualWeightKg != null && targetWeightKg.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = actualWeightKg.subtract(targetWeightKg).abs();
            this.variancePercentage = diff.divide(targetWeightKg, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            
            // Abort transaction and rollback if fuel weight deviates by more than 1.0%
            if (this.variancePercentage.compareTo(new BigDecimal("1.00")) > 0) {
                throw new IllegalArgumentException("Fuel load variance (" + this.variancePercentage + "%) exceeds mandatory +-1.0% tolerance limit per NFR 3.11.");
            }
        }
    }
}
