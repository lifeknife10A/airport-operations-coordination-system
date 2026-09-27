package com.saphire.aocs.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "lost_and_found_items")
public class LostFoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "reference_code", length = 30, nullable = false, unique = true)
    private String referenceCode;

    @Column(name = "item_name", length = 150, nullable = false)
    private String itemName;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "color_and_description", columnDefinition = "TEXT", nullable = false)
    private String colorAndDescription;

    @Column(name = "found_location_type", length = 50, nullable = false)
    private String foundLocationType;

    @Column(name = "found_location_detail", length = 150, nullable = false)
    private String foundLocationDetail;

    @Column(name = "terminal_id", nullable = false)
    private Integer terminalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @Column(name = "checkpoint_id")
    private Long checkpointId;

    @Column(name = "storage_vault_location", length = 100, nullable = false)
    private String storageVaultLocation;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "finder_type", length = 50, nullable = false)
    private String finderType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "logged_by_user_id", nullable = false)
    private User loggedByUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimant_traveler_id")
    private Traveler claimantTraveler;

    @Column(name = "claimant_name", length = 100)
    private String claimantName;

    @Column(name = "claimant_contact_email", length = 100)
    private String claimantContactEmail;

    @Column(name = "claimant_contact_phone", length = 30)
    private String claimantContactPhone;

    @Column(name = "claim_verification_notes", columnDefinition = "TEXT")
    private String claimVerificationNotes;

    @Column(name = "claimed_timestamp")
    private OffsetDateTime claimedTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "released_by_user_id")
    private User releasedByUser;

    public LostFoundItem() {}

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

    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }

    public Long getCheckpointId() { return checkpointId; }
    public void setCheckpointId(Long checkpointId) { this.checkpointId = checkpointId; }

    public String getStorageVaultLocation() { return storageVaultLocation; }
    public void setStorageVaultLocation(String storageVaultLocation) { this.storageVaultLocation = storageVaultLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFinderType() { return finderType; }
    public void setFinderType(String finderType) { this.finderType = finderType; }

    public User getLoggedByUser() { return loggedByUser; }
    public void setLoggedByUser(User loggedByUser) { this.loggedByUser = loggedByUser; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Traveler getClaimantTraveler() { return claimantTraveler; }
    public void setClaimantTraveler(Traveler claimantTraveler) { this.claimantTraveler = claimantTraveler; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantContactEmail() { return claimantContactEmail; }
    public void setClaimantContactEmail(String claimantContactEmail) { this.claimantContactEmail = claimantContactEmail; }

    public String getClaimantContactPhone() { return claimantContactPhone; }
    public void setClaimantContactPhone(String claimantContactPhone) { this.claimantContactPhone = claimantContactPhone; }

    public String getClaim_verification_notes() { return claimVerificationNotes; }
    public String getClaimVerificationNotes() { return claimVerificationNotes; }
    public void setClaimVerificationNotes(String claimVerificationNotes) { this.claimVerificationNotes = claimVerificationNotes; }

    public OffsetDateTime getClaimedTimestamp() { return claimedTimestamp; }
    public void setClaimedTimestamp(OffsetDateTime claimedTimestamp) { this.claimedTimestamp = claimedTimestamp; }

    public User getReleasedByUser() { return releasedByUser; }
    public void setReleasedByUser(User releasedByUser) { this.releasedByUser = releasedByUser; }
}
