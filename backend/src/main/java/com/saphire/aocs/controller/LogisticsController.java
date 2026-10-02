package com.saphire.aocs.controller;

import com.saphire.aocs.dto.Logistics.*;
import com.saphire.aocs.service.LogisticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** The Logistics desk: cargo, baggage carousels, fuel and ground equipment. */
@RestController
@RequestMapping({"/api/logistics", "/api/v1/logistics"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BAGGAGE_HANDLER', 'GROUND_HANDLING_SUPERVISOR', 'SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
public class LogisticsController {

    private final LogisticsService logisticsService;

    @GetMapping("/cargo")
    public CargoPage cargo(@RequestParam(required = false, name = "q") String query,
                           @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "25") int size) {
        return logisticsService.getCargo(query, page, size);
    }

    @GetMapping("/cargo/totals")
    public List<CargoTypeTotal> cargoTotals() {
        return logisticsService.getCargoTotals();
    }

    @GetMapping("/carousels")
    public List<Carousel> carousels() {
        return logisticsService.getCarousels();
    }

    @PreAuthorize("hasAnyRole('BAGGAGE_HANDLER', 'SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @PutMapping("/carousels/{id}/flight")
    public Carousel assignCarousel(@PathVariable Long id, @Valid @RequestBody CarouselAssignment dto) {
        return logisticsService.assignCarousel(id, dto.flightId());
    }

    @GetMapping("/fuel")
    public FuelPage fuel(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "25") int size) {
        return logisticsService.getFuel(page, size);
    }

    @GetMapping("/equipment")
    public List<EquipmentTotal> equipment() {
        return logisticsService.getEquipmentTotals();
    }
}
