package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    // Missing entirely from the original DTO. Without this, there was nothing for the frontend
    // to present as proof of authentication on any subsequent request.
    private String token;

    private Long userId;
    private String username;
    private String name;
    private Long roleId;
    private String roleName;
    private Long departmentId;
    private String departmentName;
}
