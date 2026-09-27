package com.saphire.aocs.dto;

import java.time.OffsetDateTime;

public class LostFoundResponseDTO {
    private Long itemId;
    private String referenceCode;
    private String itemName;
    private String category;
    private String colorAndDescription;
    private String foundLocationType;
    private String foundLocationDetail;
    private Integer terminalId;
    private Long flightId;
    private String flightNumber;
    private Long checkpointId;
    private String storageVaultLocation;
    private String status;
    private String finderType;
    private Long loggedByUserId;
    private String loggedByUserName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Long claimantTravelerId;
    private String claimantName;
    private String claimantContactEmail;
    private String claimantContactPhone;
    private String claimVerificationNotes;
    private OffsetDateTime claimedTimestamp;
    private Long releasedByUserId;
    private String releasedByUserName;

    public LostFoundResponseDTO() {}

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

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

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public Long getCheckpointId() { return checkpointId; }
    public void setCheckpointId(Long checkpointId) { this.checkpointId = checkpointId; }

    public String getStorageVaultLocation() { return storageVaultLocation; }
    public void setStorageVaultLocation(String storageVaultLocation) { this.storageVaultLocation = storageVaultLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFinderType() { return finderType; }
    public void setFinderType(String finderType) { this.finderType = finderType; }

    public Long getLoggedByUserId() { return loggedByUserId; }
    public void setLoggedByUserId(Long loggedByUserId) { this.loggedByUserId = loggedByUserId; }

    public String getLoggedByUserName() { return loggedByUserName; }
    public void setLoggedByUserName(String loggedByUserName) { this.loggedByUserName = loggedByUserName; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getClaimantTravelerId() { return claimantTravelerId; }
    public void setClaimantTravelerId(Long claimantTravelerId) { this.claimantTravelerId = claimantTravelerId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantContactEmail() { return claimantContactEmail; }
    public void setClaimantContactEmail(String claimantContactEmail) { this.claimantContactEmail = claimantContactEmail; }

    public String getClaimantContactPhone() { return claimantContactPhone; }
    public void setClaimantContactPhone(String claimantContactPhone) { this.claimantContactPhone = claimantContactPhone; }

    public String getClaimVerificationNotes() { return claimVerificationNotes; }
    public void setClaimVerificationNotes(String claimVerificationNotes) { this.claimVerificationNotes = claimVerificationNotes; }

    public OffsetDateTime getClaimedTimestamp() { return claimedTimestamp; }
    public void setClaimedTimestamp(OffsetDateTime claimedTimestamp) { this.claimedTimestamp = claimedTimestamp; }

    public Long getReleasedByUserId() { return releasedByUserId; }
    public void setReleasedByUserId(Long releasedByUserId) { this.releasedByUserId = releasedByUserId; }

    public String getReleasedByUserName() { return releasedByUserName; }
    public void setReleasedByUserName(String releasedByUserName) { this.releasedByUserName = releasedByUserName; }
}
