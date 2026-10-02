package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DelayEntryDTO {
    private Long flightId;
    private String flightNumber;
    private String route;
    private Integer seqNo;
    private String delayCode;
    private String category;
    private String description;
    private Integer delayMinutes;
}
