package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LostFoundReportDTO {

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "Category is required")
    @jakarta.validation.constraints.Pattern(regexp = "ELECTRONICS|BAGGAGE|DOCUMENTS|CLOTHING|JEWELRY|VALUABLES|KEYS|OTHER", message = "Unknown category")
    private String category;

    @NotBlank(message = "Color and description are required")
    private String colorAndDescription;

    @NotBlank(message = "Found location type is required")
    @jakarta.validation.constraints.Pattern(regexp = "SECURITY_CHECKPOINT|GATE_SEATING|DUTY_FREE|AIRCRAFT_CABIN|BAGGAGE_RECLAIM|CONCOURSE|RESTROOM|LOUNGE|OTHER", message = "Unknown found-location type")
    private String foundLocationType;

    @NotBlank(message = "Found location detail is required")
    private String foundLocationDetail;

    @NotNull(message = "Terminal ID is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Terminal ID must be 1 or 2")
    @jakarta.validation.constraints.Max(value = 2, message = "Terminal ID must be 1 or 2")
    private Integer terminalId;

    private Long flightId;
    private Long checkpointId;
    private String storageVaultLocation;

    @NotBlank(message = "Finder type is required")
    @jakarta.validation.constraints.Pattern(regexp = "PASSENGER|SECURITY_OFFICER|CABIN_CLEANER|GATE_AGENT|GROUND_HANDLER|DUTY_FREE_STAFF", message = "Unknown finder type")
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
