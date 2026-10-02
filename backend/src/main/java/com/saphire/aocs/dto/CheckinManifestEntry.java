package com.saphire.aocs.dto;

/** One passenger on a flight as the check-in desk sees them. */
public record CheckinManifestEntry(Long passengerId, String pnr, String name, String nationality,
                                   Long boardingPassId, String seat, String cabinClass, String boardingGroup,
                                   String ticketNumber, String barcodeData, long bags, double bagWeightKg) {}
