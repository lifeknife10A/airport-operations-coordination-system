package com.saphire.aocs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.ZonedDateTime;

/** Request/response shapes for the Passenger Security desk. Passport numbers never leave the server in full. */
public final class SecurityOps {
    private SecurityOps() {}

    /** A flight that is boarding (or delayed at the gate), with how far clearance and the turnaround have got. */
    public record GateFlight(Long flightId, String flightNumber, String airline, String destination, String gate, String terminal,
                             ZonedDateTime scheduledDeparture, String flightStatus,
                             long booked, long boardingPasses, long approved, long boarded, long flagged, long denied,
                             long tasksTotal, long tasksCompleted, long tasksBlocked) {}

    /** One passenger on a flight with their latest clearance scan (null status = not scanned yet). */
    public record ManifestEntry(Long passengerId, String pnr, String name, String passportLast4, String nationality,
                                Long boardingPassId, String seat, String cabinClass, String boardingGroup,
                                String clearanceStatus, String verificationMethod, ZonedDateTime scannedAt, String denialReason) {}

    public record ClearanceEntry(Long clearanceId, ZonedDateTime scannedAt, String passenger, String pnr, String flightNumber,
                                 String clearanceStatus, String verificationMethod, String checkpoint, String denialReason) {}

    public record Checkpoint(Long checkpointId, String name, String type, String terminal) {}

    public record Incident(Long incidentId, String title, String location, String severity, String status, String description,
                           String flightNumber, String reportedBy, ZonedDateTime reportedAt, ZonedDateTime resolvedAt) {}

    public record IncidentCreate(
            @NotBlank @Size(max = 150) String title,
            @NotBlank @Size(max = 150) String location,
            @NotNull @Pattern(regexp = "CRITICAL|HIGH|MEDIUM|LOW") String severity,
            @Size(max = 2000) String description,
            Long flightId) {}

    public record IncidentStatusUpdate(@NotNull @Pattern(regexp = "INVESTIGATING|ESCALATED|RESOLVED") String status) {}

    public record Lounge(String name, long visits, long distinctPassengers) {}

    public record LoungeVisit(Long visitId, String lounge, String passenger, String pnr, String flightNumber) {}

    public record LoungeVisitCreate(@NotBlank String loungeName, @NotNull Long passengerId) {}

    public record ClearanceCreate(
            @NotNull Long passengerId,
            @NotNull @Pattern(regexp = "APPROVED|FLAGGED_SECURITY|DENIED|BOARDED") String clearanceStatus,
            @NotNull @Pattern(regexp = "BARCODE_SCANNER|BIOMETRIC_FACIAL|PASSPORT_CHIP_READER") String verificationMethod,
            @NotNull Long checkpointId,
            @Size(max = 100) String denialReason) {}
}
