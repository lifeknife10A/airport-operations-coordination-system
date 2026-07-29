package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long taskId;
    private Long flightId;
    private String flightNumber;
    private Long assignedUserId;
    private String assignedUserName;
    private String taskName;
    private String status;
    private ZonedDateTime scheduledStart;
    private ZonedDateTime scheduledEnd;
    private ZonedDateTime actualStart;
    private ZonedDateTime actualEnd;
    private String notes;

    // Record-style accessor aliases for full compatibility
    public String status() {
        return status;
    }

    public Long assignedUserId() {
        return assignedUserId;
    }

    public String assignedUserName() {
        return assignedUserName;
    }
}
