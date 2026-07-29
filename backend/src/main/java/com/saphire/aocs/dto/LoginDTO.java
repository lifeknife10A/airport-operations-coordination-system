package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginDTO {

    @NotBlank(message = "Username is required")
    private String username;

    // Was missing @NotBlank in the original — an empty-string password was syntactically valid
    // input. Moot once AuthService actually checks it, but this is defense in depth and costs
    // nothing.
    @NotBlank(message = "Password is required")
    private String password;
}
