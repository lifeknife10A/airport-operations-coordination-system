package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passenger_manifests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerManifest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "passenger_name", length = 100, nullable = false)
    private String passengerName;

    @Column(name = "passport_number", length = 50, nullable = false)
    private String passportNumber;

    @Column(name = "seat_number", length = 10, nullable = false)
    private String seatNumber;

    @Column(name = "is_boarded", nullable = false)
    private Boolean isBoarded;

    /**
     * Out-of-the-box Masked Passport Helper for NFR 3.15 Confidentiality Compliance.
     * Displays only the last 4 characters for non-immigration roles.
     */
    public String getMaskedPassportNumber() {
        if (passportNumber == null || passportNumber.length() <= 4) {
            return "****";
        }
        return "XXXX-XXXX-" + passportNumber.substring(passportNumber.length() - 4);
    }
}
