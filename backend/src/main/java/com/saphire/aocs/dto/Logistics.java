package com.saphire.aocs.dto;

import jakarta.validation.constraints.Min;

import java.util.List;

/** Read models and requests for the Logistics desk (cargo, carousels, fuel, ground equipment). */
public final class Logistics {
    private Logistics() {}

    public record CargoItem(Long cargoId, String containerId, double weightKg, String cargoType,
                            Long flightId, String flightNumber, String airline) {}

    public record CargoTypeTotal(String cargoType, long containers, double totalKg) {}

    public record Carousel(Long carouselId, String carouselNumber, String terminal,
                           Long flightId, String flightNumber, String airline, String origin, String flightType, String flightStatus) {}

    /** flightId null clears the carousel. */
    public record CarouselAssignment(@Min(1) Long flightId) {}

    public record FuelEntry(Long fuelLogId, double fuelDensity, Long taskId, String taskName, String taskStatus,
                            Long flightId, String flightNumber, String stand) {}

    public record EquipmentTotal(String equipmentType, long available, long inUse, long maintenance) {}

    public record CargoPage(List<CargoItem> content, int page, int size, long totalElements, int totalPages) {}

    public record FuelPage(List<FuelEntry> content, int page, int size, long totalElements, int totalPages) {}
}
