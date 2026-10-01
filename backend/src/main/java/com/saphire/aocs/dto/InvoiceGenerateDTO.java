package com.saphire.aocs.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceGenerateDTO {

    @NotNull(message = "Airline ID is required")
    private Long airlineId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.00", message = "Total amount must be zero or positive")
    private BigDecimal totalAmountUsd;

    @NotBlank(message = "Invoice number is required")
    @Size(max = 50, message = "Invoice number must be at most 50 characters")
    private String invoiceNumber;
}
