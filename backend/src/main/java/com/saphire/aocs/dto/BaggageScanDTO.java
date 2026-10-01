package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaggageScanDTO {

    @NotBlank(message = "Tag number is required")
    private String tagNumber;

    @NotBlank(message = "Scan location is required")
    @Size(max = 100, message = "Scan location must be at most 100 characters")
    private String location;
}
