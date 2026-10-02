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
public class AirsideConflictsDTO {
    private long total;
    private long wingspanOversize;
    private long gateConflicts;
    /** The first `limit` conflicts, gate conflicts before wingspan ones. */
    private List<AirsideConflictDTO> items;
}
