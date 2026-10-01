package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;

public class LostFoundClaimDTO {

    private Long claimantTravelerId;

    @NotBlank(message = "Claimant name is required")
    private String claimantName;

    @NotBlank(message = "Contact email is required")
    private String claimantContactEmail;

    private String claimantContactPhone;

    @NotBlank(message = "Verification notes are required")
    private String claimVerificationNotes;

    private Long releasedByUserId;

    public LostFoundClaimDTO() {}

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

    public Long getReleasedByUserId() { return releasedByUserId; }
    public void setReleasedByUserId(Long releasedByUserId) { this.releasedByUserId = releasedByUserId; }
}
