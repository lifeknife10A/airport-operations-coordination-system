package com.saphire.aocs.dto;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusUpdateDTO {
    @Pattern(regexp = "ACTIVE|SUSPENDED", message = "Status must be ACTIVE or SUSPENDED")
    private String status;
}
