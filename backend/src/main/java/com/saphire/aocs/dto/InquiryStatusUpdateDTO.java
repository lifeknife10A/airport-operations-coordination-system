package com.saphire.aocs.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryStatusUpdateDTO {

    @Pattern(regexp = "OPEN|ASSIGNED|UNDER_INVESTIGATION|RESOLVED|CLOSED", message = "Unknown status")
    private String status;

    @Size(max = 5000, message = "Resolution notes must be at most 5000 characters")
    private String resolutionNotes;

    @Positive(message = "Assigned staff user id must be positive")
    private Long assignedStaffUserId;

    @Size(max = 50, message = "Assigned department must be at most 50 characters")
    private String assignedDepartment;
}
