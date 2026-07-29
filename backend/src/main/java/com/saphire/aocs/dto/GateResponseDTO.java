package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GateResponseDTO {
    private Long gateId;
    private String gateNumber;
    private List<StandInfo> stands;
    private List<FlightDTO> activeFlights;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StandInfo {
        private Long standId;
        private String standNumber;
        private Boolean isRemote;
        private Boolean hasJetbridge;
    }
}
