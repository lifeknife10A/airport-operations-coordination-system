package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinCounterDTO {
    private Long counterId;
    private String counterNumber;
    private String terminal;
    private String concourse;
    private Long allocatedAirlineId;
    private String allocatedAirlineName;
    private String allocatedAirlineIata;
    private String status; // OPEN, CLOSED, SERVICING
}
