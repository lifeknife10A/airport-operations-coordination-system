package com.saphire.aocs.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponseDTO {
    private Long inquiryId;
    private String ticketNumber;
    private String fullName;
    private String emailAddress;
    private String phoneNumber;
    private String category;
    private String inquiryDetails;
    private String priority;
    private String status;
    private String sourceChannel;
    private String assignedDepartment;
    private Long assignedStaffUserId;
    private String assignedStaffName;
    private Long linkedFlightId;
    private String linkedFlightNumber;
    private Long linkedTravelerId;
    private String resolutionNotes;
    private OffsetDateTime resolvedAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
