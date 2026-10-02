package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DelayCodeDTO {
    private String delayCode;
    private String category;
    private String description;
}
