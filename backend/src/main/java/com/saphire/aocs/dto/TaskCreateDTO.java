package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskCreateDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotBlank(message = "Task name is required")
    private String taskName;

    private Long assignedUserId;

    private ZonedDateTime scheduledStart;
    private ZonedDateTime scheduledEnd;
}
