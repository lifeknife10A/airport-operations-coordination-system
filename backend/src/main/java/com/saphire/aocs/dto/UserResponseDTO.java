package com.saphire.aocs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private String name;
    private String role;
    private String department;
    /**
     * Always "ACTIVE": users has no status/active column at all (checked the entity and the live
     * schema), so there is no real suspended state to report here. See UserStatusUpdateDTO.
     */
    private String status;
}
