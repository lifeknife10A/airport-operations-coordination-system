package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "travelers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Traveler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "traveler_id")
    private Long travelerId;

    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @Column(name = "passport_number", length = 20, nullable = false, unique = true)
    private String passportNumber;

    @Column(name = "nationality", length = 50, nullable = false)
    private String nationality;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;
}
