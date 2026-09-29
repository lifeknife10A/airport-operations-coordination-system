package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryCreateDTO {
    private String fullName;
    private String emailAddress;
    private String phoneNumber;
    private String category;
    private String inquiryDetails;
    private String priority;
    private String sourceChannel;
    private Long linkedFlightId;
    private Long linkedTravelerId;
}
