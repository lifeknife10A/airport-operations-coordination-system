package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Everything the AOCC needs about one flight: its turnaround tasks, delay log and passenger count. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightOperationsDTO {
    private FlightDTO flight;
    private List<TaskDTO> tasks;
    private List<DelayEntryDTO> delays;
    /** Boarding passes issued for this flight. */
    private long boardingPasses;
}
