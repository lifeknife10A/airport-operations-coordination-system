package com.saphire.aocs.dto;

import lombok.*;

import java.time.OffsetDateTime;

/**
 * What an anonymous caller may learn from a ticket number: where their request stands, and
 * nothing that identifies the person who filed it. The full record (name, email, phone, message,
 * internal notes) is staff-only -- ticket numbers are short, so they can't be treated as a secret.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryPublicStatusDTO {
    private String ticketNumber;
    private String category;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime resolvedAt;
}
