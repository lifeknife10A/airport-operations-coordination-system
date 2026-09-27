package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LostFoundReportDTO {

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Color and description are required")
    private String colorAndDescription;

    @NotBlank(message = "Found location type is required")
    private String foundLocationType;

    @NotBlank(message = "Found location detail is required")
    private String foundLocationDetail;

    @NotNull(message = "Terminal ID is required")
    private Integer terminalId;

    private Long flightId;
    private Long checkpointId;
    private String storageVaultLocation;

    @NotBlank(message = "Finder type is required")
    private String finderType;

    private Long loggedByUserId;

    public LostFoundReportDTO() {}

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColorAndDescription() { return colorAndDescription; }
    public void setColorAndDescription(String colorAndDescription) { this.colorAndDescription = colorAndDescription; }

    public String getFoundLocationType() { return foundLocationType; }
    public void setFoundLocationType(String foundLocationType) { this.foundLocationType = foundLocationType; }

    public String getFoundLocationDetail() { return foundLocationDetail; }
    public void setFoundLocationDetail(String foundLocationDetail) { this.foundLocationDetail = foundLocationDetail; }

    public Integer getTerminalId() { return terminalId; }
    public void setTerminalId(Integer terminalId) { this.terminalId = terminalId; }

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public Long getCheckpointId() { return checkpointId; }
    public void setCheckpointId(Long checkpointId) { this.checkpointId = checkpointId; }

    public String getStorageVaultLocation() { return storageVaultLocation; }
    public void setStorageVaultLocation(String storageVaultLocation) { this.storageVaultLocation = storageVaultLocation; }

    public String getFinderType() { return finderType; }
    public void setFinderType(String finderType) { this.finderType = finderType; }

    public Long getLoggedByUserId() { return loggedByUserId; }
    public void setLoggedByUserId(Long loggedByUserId) { this.loggedByUserId = loggedByUserId; }
}
