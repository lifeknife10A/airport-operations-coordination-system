package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** A flight that currently has turnaround work under way or blocked, with all of its tasks. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActiveTurnaroundDTO {
    private FlightDTO flight;
    private String concourse;
    private List<TaskDTO> tasks;
}
