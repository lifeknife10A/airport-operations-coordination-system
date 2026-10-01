package com.saphire.aocs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Body of the public contact form (POST /api/inquiries is reachable without logging in), so every
 * field is bounded to what the operational_inquiries columns can actually hold -- V8 defines
 * full_name/email as VARCHAR(150) and phone as VARCHAR(30), plus CHECK constraints on the
 * category/priority/source values -- instead of letting oversized or malformed input through to
 * a database error.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryCreateDTO {

    @NotBlank(message = "Full name is required")
    @Size(max = 150, message = "Full name must be at most 150 characters")
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Email address is not valid")
    @Size(max = 150, message = "Email address must be at most 150 characters")
    private String emailAddress;

    @Size(max = 30, message = "Phone number must be at most 30 characters")
    @Pattern(regexp = "^[0-9+()\\-.\\s]*$", message = "Phone number may only contain digits, spaces and + ( ) - .")
    private String phoneNumber;

    @Pattern(regexp = "GENERAL_PASSENGER_ASSISTANCE|FLIGHT_SCHEDULE_STATUS|LOST_PROPERTY_BAGGAGE|CARGO_CUSTOMS|VIP_PROTOCOL|ACCESSIBILITY_SPECIAL_ASSISTANCE|SECURITY_SAFETY|OTHER",
             message = "Unknown category")
    private String category;

    @NotBlank(message = "Inquiry details are required")
    @Size(max = 5000, message = "Inquiry details must be at most 5000 characters")
    private String inquiryDetails;

    @Pattern(regexp = "LOW|NORMAL|URGENT|CRITICAL", message = "Unknown priority")
    private String priority;

    @Pattern(regexp = "WEB_PORTAL|INFORMATION_DESK|PHONE_HELPLINE|EMAIL_DIRECT", message = "Unknown source channel")
    private String sourceChannel;

    @Positive(message = "Linked flight id must be positive")
    private Long linkedFlightId;

    @Positive(message = "Linked traveler id must be positive")
    private Long linkedTravelerId;
}
