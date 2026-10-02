package com.saphire.aocs.service;

import com.saphire.aocs.dto.Logistics.*;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Cargo, baggage carousels, fuel and ground equipment as read from the operational tables. */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogisticsService {

    private static final int MAX_PAGE_SIZE = 100;

    private static final String CAROUSEL_SELECT =
            "SELECT c.carousel_id, c.carousel_number, c.terminal, f.flight_id, f.flight_number, al.airline_name, "
            + "oa.iata_code AS origin, f.flight_type, f.flight_status "
            + "FROM baggage_carousels c LEFT JOIN flights f ON f.flight_id = c.flight_id "
            + "LEFT JOIN airlines al ON al.airline_id = f.airline_id LEFT JOIN airports oa ON oa.airport_id = f.origin_airport_id ";

    private final JdbcTemplate jdbc;

    private static Carousel carousel(java.sql.ResultSet rs, int i) throws java.sql.SQLException {
        return new Carousel(rs.getLong("carousel_id"), rs.getString("carousel_number"), rs.getString("terminal"),
                (Long) rs.getObject("flight_id"), rs.getString("flight_number"), rs.getString("airline_name"),
                rs.getString("origin"), rs.getString("flight_type"), rs.getString("flight_status"));
    }

    @Transactional(readOnly = true)
    public CargoPage getCargo(String query, int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        String like = "%" + (query == null ? "" : query.trim().toLowerCase()) + "%";
        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM cargo_manifests m JOIN flights f ON f.flight_id = m.flight_id "
                + "WHERE LOWER(m.container_id) LIKE ? OR LOWER(f.flight_number) LIKE ? OR LOWER(m.cargo_type) LIKE ?",
                Long.class, like, like, like);
        List<CargoItem> rows = jdbc.query(
                "SELECT m.cargo_id, m.container_id, m.weight_kg, m.cargo_type, f.flight_id, f.flight_number, al.airline_name "
                + "FROM cargo_manifests m JOIN flights f ON f.flight_id = m.flight_id JOIN airlines al ON al.airline_id = f.airline_id "
                + "WHERE LOWER(m.container_id) LIKE ? OR LOWER(f.flight_number) LIKE ? OR LOWER(m.cargo_type) LIKE ? "
                + "ORDER BY m.cargo_id DESC LIMIT ? OFFSET ?",
                (rs, i) -> new CargoItem(rs.getLong(1), rs.getString(2), rs.getDouble(3), rs.getString(4), rs.getLong(5), rs.getString(6), rs.getString(7)),
                like, like, like, safeSize, (long) safePage * safeSize);
        long totalElements = total == null ? 0 : total;
        return new CargoPage(rows, safePage, safeSize, totalElements, (int) Math.ceil(totalElements / (double) safeSize));
    }

    @Transactional(readOnly = true)
    public List<CargoTypeTotal> getCargoTotals() {
        return jdbc.query("SELECT cargo_type, COUNT(*), COALESCE(SUM(weight_kg), 0) FROM cargo_manifests GROUP BY cargo_type ORDER BY cargo_type",
                (rs, i) -> new CargoTypeTotal(rs.getString(1), rs.getLong(2), rs.getDouble(3)));
    }

    @Transactional(readOnly = true)
    public List<Carousel> getCarousels() {
        return jdbc.query(CAROUSEL_SELECT + "ORDER BY c.carousel_number", LogisticsService::carousel);
    }

    /**
     * Puts a flight on a carousel, or clears it (flightId null). A flight can only be on one
     * carousel at a time, and a cancelled or departed flight cannot be given one.
     */
    @Transactional
    public Carousel assignCarousel(Long carouselId, Long flightId) {
        Integer exists = jdbc.queryForObject("SELECT COUNT(*) FROM baggage_carousels WHERE carousel_id = ?", Integer.class, carouselId);
        if (exists == null || exists == 0) throw new ResourceNotFoundException("Carousel not found with ID: " + carouselId);

        if (flightId != null) {
            List<String> status = jdbc.queryForList("SELECT flight_status FROM flights WHERE flight_id = ?", String.class, flightId);
            if (status.isEmpty()) throw new ResourceNotFoundException("Flight not found with ID: " + flightId);
            if ("CANCELLED".equals(status.get(0)) || "DEPARTED".equals(status.get(0))) {
                throw new ConflictException("A " + status.get(0).toLowerCase() + " flight cannot be given a baggage carousel");
            }
            List<String> other = jdbc.queryForList(
                    "SELECT carousel_number FROM baggage_carousels WHERE flight_id = ? AND carousel_id <> ?", String.class, flightId, carouselId);
            if (!other.isEmpty()) throw new ConflictException("That flight is already on carousel " + other.get(0));
        }
        jdbc.update("UPDATE baggage_carousels SET flight_id = ? WHERE carousel_id = ?", flightId, carouselId);
        log.info("Carousel {} now serves flight {}", carouselId, flightId);
        return jdbc.query(CAROUSEL_SELECT + "WHERE c.carousel_id = ?", LogisticsService::carousel, carouselId).get(0);
    }

    @Transactional(readOnly = true)
    public FuelPage getFuel(int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM fuel_logs", Long.class);
        List<FuelEntry> rows = jdbc.query(
                "SELECT l.fuel_log_id, l.fuel_density, t.task_id, t.task_name, t.status, f.flight_id, f.flight_number, s.stand_number "
                + "FROM fuel_logs l JOIN tasks t ON t.task_id = l.task_id JOIN flights f ON f.flight_id = t.flight_id "
                + "LEFT JOIN stands s ON s.stand_id = f.stand_id ORDER BY l.fuel_log_id DESC LIMIT ? OFFSET ?",
                (rs, i) -> new FuelEntry(rs.getLong(1), rs.getDouble(2), rs.getLong(3), rs.getString(4), rs.getString(5), rs.getLong(6), rs.getString(7), rs.getString(8)),
                safeSize, (long) safePage * safeSize);
        long totalElements = total == null ? 0 : total;
        return new FuelPage(rows, safePage, safeSize, totalElements, (int) Math.ceil(totalElements / (double) safeSize));
    }

    @Transactional(readOnly = true)
    public List<EquipmentTotal> getEquipmentTotals() {
        return jdbc.query(
                "SELECT equipment_type, COUNT(*) FILTER (WHERE status = 'AVAILABLE'), COUNT(*) FILTER (WHERE status = 'IN_USE'), "
                + "COUNT(*) FILTER (WHERE status = 'MAINTENANCE') FROM ground_equipment GROUP BY equipment_type ORDER BY equipment_type",
                (rs, i) -> new EquipmentTotal(rs.getString(1), rs.getLong(2), rs.getLong(3), rs.getLong(4)));
    }
}
