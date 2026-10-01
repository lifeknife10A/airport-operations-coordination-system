package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;

public class LostFoundStatusDTO {

    @NotBlank(message = "Status is required")
    private String status;

    private String storageVaultLocation;

    public LostFoundStatusDTO() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStorageVaultLocation() { return storageVaultLocation; }
    public void setStorageVaultLocation(String storageVaultLocation) { this.storageVaultLocation = storageVaultLocation; }
}
