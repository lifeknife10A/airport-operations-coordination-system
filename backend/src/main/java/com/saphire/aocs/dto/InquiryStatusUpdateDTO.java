package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryStatusUpdateDTO {
    private String status;
    private String resolutionNotes;
    private Long assignedStaffUserId;
    private String assignedDepartment;
}
