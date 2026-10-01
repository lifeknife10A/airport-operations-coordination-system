package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClearanceLogDTO {

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;

    @Pattern(regexp = "APPROVED|FLAGGED_SECURITY|DENIED|BOARDED", message = "Unknown clearance status")
    private String clearanceStatus;

    @Size(max = 100, message = "Denial reason must be at most 100 characters")
    private String denialReason;

    @Pattern(regexp = "BARCODE_SCANNER|BIOMETRIC_FACIAL|PASSPORT_CHIP_READER", message = "Unknown verification method")
    private String verificationMethod;

    private Long boardingPassId;
    private Long checkpointId;
}
