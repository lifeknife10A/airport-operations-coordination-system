package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** A ramp staff member and how much turnaround work is currently on their plate. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffWorkloadDTO {
    private Long userId;
    private String name;
    private String username;
    private String departmentName;
    private long inProgressTasks;
    private long openTasks;
}
