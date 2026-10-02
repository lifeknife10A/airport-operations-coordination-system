package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** The new account plus its one-time temporary password (never stored or retrievable again). */
@Data
@AllArgsConstructor
public class UserCreatedResponseDTO {
    private UserResponseDTO user;
    private String temporaryPassword;
}
