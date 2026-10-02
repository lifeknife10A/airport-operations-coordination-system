package com.saphire.aocs.service;

import com.saphire.aocs.dto.PagedResponseDTO;
import com.saphire.aocs.dto.SecurityOps.*;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

/** Read models and writes behind the Passenger Security desk (clearance, incidents, lounges). */
@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityOpsService {

    private static final int MAX_PAGE_SIZE = 100;

    private final JdbcTemplate jdbc;
    private final UserRepository userRepository;

    private static ZonedDateTime time(ResultSet rs, String column) throws SQLException {
        Timestamp ts = rs.getTimestamp(column);
        return ts == null ? null : ts.toInstant().atZone(ZoneId.systemDefault());
    }

    private static <T> PagedResponseDTO<T> page(List<T> rows, int page, int size, long total) {
        return PagedResponseDTO.<T>builder().content(rows).page(page).size(size).totalElements(total)
                .totalPages((int) Math.ceil(total / (double) size)).build();
    }

    private Long userIdFor(String username) {
        return userRepository.findByUsername(username).map(User::getUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    // ---------------------------------------------------------------------------------------
    // Boarding flights and manifests
    // ---------------------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<GateFlight> getGateFlights(int limit) {
        int safe = Math.max(1, Math.min(limit, 50));
        return jdbc.query(
                "SELECT f.flight_id, f.flight_number, al.airline_name, da.iata_code AS destination, g.gate_number, g.terminal, "
                + "f.scheduled_departure_time, f.flight_status, "
                + "(SELECT COUNT(*) FROM passengers p WHERE p.flight_id = f.flight_id) AS booked, "
                + "(SELECT COUNT(*) FROM boarding_passes b WHERE b.flight_id = f.flight_id) AS passes, "
                + "(SELECT COUNT(*) FROM passenger_clearance_logs c JOIN passengers p ON p.passenger_id = c.passenger_id WHERE p.flight_id = f.flight_id AND c.clearance_status = 'APPROVED') AS approved, "
                + "(SELECT COUNT(*) FROM passenger_clearance_logs c JOIN passengers p ON p.passenger_id = c.passenger_id WHERE p.flight_id = f.flight_id AND c.clearance_status = 'BOARDED') AS boarded, "
                + "(SELECT COUNT(*) FROM passenger_clearance_logs c JOIN passengers p ON p.passenger_id = c.passenger_id WHERE p.flight_id = f.flight_id AND c.clearance_status = 'FLAGGED_SECURITY') AS flagged, "
                + "(SELECT COUNT(*) FROM passenger_clearance_logs c JOIN passengers p ON p.passenger_id = c.passenger_id WHERE p.flight_id = f.flight_id AND c.clearance_status = 'DENIED') AS denied, "
                + "(SELECT COUNT(*) FROM tasks t WHERE t.flight_id = f.flight_id) AS tasks_total, "
                + "(SELECT COUNT(*) FROM tasks t WHERE t.flight_id = f.flight_id AND t.status = 'COMPLETED') AS tasks_done, "
                + "(SELECT COUNT(*) FROM tasks t WHERE t.flight_id = f.flight_id AND t.status = 'BLOCKED') AS tasks_blocked "
                + "FROM flights f JOIN airlines al ON al.airline_id = f.airline_id JOIN airports da ON da.airport_id = f.destination_airport_id "
                + "LEFT JOIN gates g ON g.gate_id = f.gate_id "
                + "WHERE f.flight_status IN ('BOARDING', 'DELAYED') "
                + "ORDER BY CASE f.flight_status WHEN 'BOARDING' THEN 0 ELSE 1 END, f.scheduled_departure_time DESC LIMIT ?",
                (rs, i) -> new GateFlight(rs.getLong("flight_id"), rs.getString("flight_number"), rs.getString("airline_name"),
                        rs.getString("destination"), rs.getString("gate_number"), rs.getString("terminal"),
                        time(rs, "scheduled_departure_time"), rs.getString("flight_status"),
                        rs.getLong("booked"), rs.getLong("passes"), rs.getLong("approved"), rs.getLong("boarded"),
                        rs.getLong("flagged"), rs.getLong("denied"),
                        rs.getLong("tasks_total"), rs.getLong("tasks_done"), rs.getLong("tasks_blocked")),
                safe);
    }

    @Transactional(readOnly = true)
    public List<ManifestEntry> getManifest(Long flightId) {
        Integer exists = jdbc.queryForObject("SELECT COUNT(*) FROM flights WHERE flight_id = ?", Integer.class, flightId);
        if (exists == null || exists == 0) throw new ResourceNotFoundException("Flight not found with ID: " + flightId);
        return jdbc.query(
                "SELECT p.passenger_id, p.pnr_code, t.first_name, t.last_name, RIGHT(t.passport_number, 4) AS passport4, t.nationality, "
                + "b.boarding_pass_id, b.seat_number, b.cabin_class, b.boarding_group, "
                + "c.clearance_status, c.verification_method, c.scan_timestamp, c.denial_reason "
                + "FROM passengers p JOIN travelers t ON t.traveler_id = p.traveler_id "
                + "LEFT JOIN boarding_passes b ON b.passenger_id = p.passenger_id AND b.flight_id = p.flight_id "
                + "LEFT JOIN LATERAL (SELECT * FROM passenger_clearance_logs c WHERE c.passenger_id = p.passenger_id "
                + "ORDER BY c.scan_timestamp DESC, c.clearance_id DESC LIMIT 1) c ON TRUE "
                + "WHERE p.flight_id = ? ORDER BY b.sequence_number NULLS LAST, p.passenger_id",
                (rs, i) -> new ManifestEntry(rs.getLong("passenger_id"), rs.getString("pnr_code"),
                        rs.getString("first_name") + " " + rs.getString("last_name"), rs.getString("passport4"), rs.getString("nationality"),
                        (Long) rs.getObject("boarding_pass_id"), rs.getString("seat_number"), rs.getString("cabin_class"), rs.getString("boarding_group"),
                        rs.getString("clearance_status"), rs.getString("verification_method"), time(rs, "scan_timestamp"), rs.getString("denial_reason")),
                flightId);
    }

    // ---------------------------------------------------------------------------------------
    // Clearance
    // ---------------------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Checkpoint> getCheckpoints() {
        return jdbc.query("SELECT checkpoint_id, checkpoint_name, checkpoint_type, terminal FROM security_checkpoints ORDER BY checkpoint_id",
                (rs, i) -> new Checkpoint(rs.getLong(1), rs.getString(2), rs.getString(3), rs.getString(4)));
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<ClearanceEntry> getClearanceLog(String status, int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        String statusFilter = status == null ? "" : status.trim().toUpperCase();
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM passenger_clearance_logs WHERE (? = '' OR clearance_status = ?)",
                Long.class, statusFilter, statusFilter);
        List<ClearanceEntry> rows = jdbc.query(
                "SELECT c.clearance_id, c.scan_timestamp, t.first_name, t.last_name, p.pnr_code, f.flight_number, c.clearance_status, "
                + "c.verification_method, k.checkpoint_name, c.denial_reason "
                + "FROM passenger_clearance_logs c JOIN passengers p ON p.passenger_id = c.passenger_id "
                + "JOIN travelers t ON t.traveler_id = p.traveler_id JOIN flights f ON f.flight_id = p.flight_id "
                + "JOIN security_checkpoints k ON k.checkpoint_id = c.checkpoint_id "
                + "WHERE (? = '' OR c.clearance_status = ?) ORDER BY c.scan_timestamp DESC, c.clearance_id DESC LIMIT ? OFFSET ?",
                (rs, i) -> new ClearanceEntry(rs.getLong("clearance_id"), time(rs, "scan_timestamp"),
                        rs.getString("first_name") + " " + rs.getString("last_name"), rs.getString("pnr_code"), rs.getString("flight_number"),
                        rs.getString("clearance_status"), rs.getString("verification_method"), rs.getString("checkpoint_name"), rs.getString("denial_reason")),
                statusFilter, statusFilter, safeSize, (long) safePage * safeSize);
        return page(rows, safePage, safeSize, total == null ? 0 : total);
    }

    /** Records a scan. The boarding pass is the passenger's own pass on their flight; a denial needs a reason. */
    @Transactional
    public ClearanceEntry logClearance(ClearanceCreate dto) {
        if ("DENIED".equals(dto.clearanceStatus()) && (dto.denialReason() == null || dto.denialReason().isBlank())) {
            throw new BadRequestException("A denial needs a reason");
        }
        Long boardingPassId;
        try {
            boardingPassId = jdbc.queryForObject(
                    "SELECT b.boarding_pass_id FROM boarding_passes b JOIN passengers p ON p.passenger_id = b.passenger_id AND p.flight_id = b.flight_id "
                    + "WHERE p.passenger_id = ? ORDER BY b.boarding_pass_id LIMIT 1", Long.class, dto.passengerId());
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("No boarding pass on record for passenger " + dto.passengerId() + " (not checked in?)");
        }
        Integer checkpoint = jdbc.queryForObject("SELECT COUNT(*) FROM security_checkpoints WHERE checkpoint_id = ?", Integer.class, dto.checkpointId());
        if (checkpoint == null || checkpoint == 0) throw new ResourceNotFoundException("Checkpoint not found: " + dto.checkpointId());

        Long id = jdbc.queryForObject(
                "INSERT INTO passenger_clearance_logs (scan_timestamp, clearance_status, denial_reason, verification_method, passenger_id, boarding_pass_id, checkpoint_id) "
                + "VALUES (CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?) RETURNING clearance_id",
                Long.class, dto.clearanceStatus(), "DENIED".equals(dto.clearanceStatus()) ? dto.denialReason().trim() : null,
                dto.verificationMethod(), dto.passengerId(), boardingPassId, dto.checkpointId());
        log.info("Clearance {} recorded for passenger {} ({})", id, dto.passengerId(), dto.clearanceStatus());
        return jdbc.query(
                "SELECT c.clearance_id, c.scan_timestamp, t.first_name, t.last_name, p.pnr_code, f.flight_number, c.clearance_status, "
                + "c.verification_method, k.checkpoint_name, c.denial_reason FROM passenger_clearance_logs c "
                + "JOIN passengers p ON p.passenger_id = c.passenger_id JOIN travelers t ON t.traveler_id = p.traveler_id "
                + "JOIN flights f ON f.flight_id = p.flight_id JOIN security_checkpoints k ON k.checkpoint_id = c.checkpoint_id WHERE c.clearance_id = ?",
                (rs, i) -> new ClearanceEntry(rs.getLong("clearance_id"), time(rs, "scan_timestamp"),
                        rs.getString("first_name") + " " + rs.getString("last_name"), rs.getString("pnr_code"), rs.getString("flight_number"),
                        rs.getString("clearance_status"), rs.getString("verification_method"), rs.getString("checkpoint_name"), rs.getString("denial_reason")),
                id).get(0);
    }

    // ---------------------------------------------------------------------------------------
    // Incidents
    // ---------------------------------------------------------------------------------------

    private static final String INCIDENT_SELECT =
            "SELECT i.incident_id, i.title, i.location, i.severity, i.status, i.description, f.flight_number, u.name AS reported_by, "
            + "i.reported_at, i.resolved_at FROM security_incidents i LEFT JOIN flights f ON f.flight_id = i.flight_id "
            + "LEFT JOIN users u ON u.user_id = i.reported_by_user_id ";

    private static Incident incident(ResultSet rs, int i) throws SQLException {
        return new Incident(rs.getLong("incident_id"), rs.getString("title"), rs.getString("location"), rs.getString("severity"),
                rs.getString("status"), rs.getString("description"), rs.getString("flight_number"), rs.getString("reported_by"),
                time(rs, "reported_at"), time(rs, "resolved_at"));
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<Incident> getIncidents(String status, int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        String statusFilter = status == null ? "" : status.trim().toUpperCase();
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM security_incidents WHERE (? = '' OR status = ?)", Long.class, statusFilter, statusFilter);
        List<Incident> rows = jdbc.query(INCIDENT_SELECT + "WHERE (? = '' OR i.status = ?) "
                        + "ORDER BY CASE i.status WHEN 'RESOLVED' THEN 1 ELSE 0 END, i.reported_at DESC LIMIT ? OFFSET ?",
                SecurityOpsService::incident, statusFilter, statusFilter, safeSize, (long) safePage * safeSize);
        return page(rows, safePage, safeSize, total == null ? 0 : total);
    }

    @Transactional
    public Incident createIncident(IncidentCreate dto, String username) {
        if (dto.flightId() != null) {
            Integer exists = jdbc.queryForObject("SELECT COUNT(*) FROM flights WHERE flight_id = ?", Integer.class, dto.flightId());
            if (exists == null || exists == 0) throw new ResourceNotFoundException("Flight not found with ID: " + dto.flightId());
        }
        Long id = jdbc.queryForObject(
                "INSERT INTO security_incidents (title, location, severity, description, flight_id, reported_by_user_id) "
                + "VALUES (?, ?, ?, ?, ?, ?) RETURNING incident_id",
                Long.class, dto.title().trim(), dto.location().trim(), dto.severity(), dto.description(), dto.flightId(), userIdFor(username));
        log.info("Security incident {} ({}) logged by {}", id, dto.severity(), username);
        return jdbc.query(INCIDENT_SELECT + "WHERE i.incident_id = ?", SecurityOpsService::incident, id).get(0);
    }

    @Transactional
    public Incident updateIncidentStatus(Long incidentId, String status, String username) {
        Long userId = userIdFor(username);
        int updated = "RESOLVED".equals(status)
                ? jdbc.update("UPDATE security_incidents SET status = ?, resolved_at = CURRENT_TIMESTAMP, resolved_by_user_id = ? WHERE incident_id = ?", status, userId, incidentId)
                : jdbc.update("UPDATE security_incidents SET status = ?, resolved_at = NULL, resolved_by_user_id = NULL WHERE incident_id = ?", status, incidentId);
        if (updated == 0) throw new ResourceNotFoundException("Incident not found with ID: " + incidentId);
        return jdbc.query(INCIDENT_SELECT + "WHERE i.incident_id = ?", SecurityOpsService::incident, incidentId).get(0);
    }

    // ---------------------------------------------------------------------------------------
    // Lounges
    // ---------------------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Lounge> getLounges() {
        return jdbc.query("SELECT lounge_name, COUNT(*) AS visits, COUNT(DISTINCT passenger_id) AS people FROM lounge_visits GROUP BY lounge_name ORDER BY lounge_name",
                (rs, i) -> new Lounge(rs.getString(1), rs.getLong(2), rs.getLong(3)));
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<LoungeVisit> getLoungeVisits(int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM lounge_visits", Long.class);
        List<LoungeVisit> rows = jdbc.query(
                "SELECT v.visit_id, v.lounge_name, t.first_name, t.last_name, p.pnr_code, f.flight_number FROM lounge_visits v "
                + "JOIN passengers p ON p.passenger_id = v.passenger_id JOIN travelers t ON t.traveler_id = p.traveler_id "
                + "JOIN flights f ON f.flight_id = p.flight_id ORDER BY v.visit_id DESC LIMIT ? OFFSET ?",
                (rs, i) -> new LoungeVisit(rs.getLong(1), rs.getString(2), rs.getString(3) + " " + rs.getString(4), rs.getString(5), rs.getString(6)),
                safeSize, (long) safePage * safeSize);
        return page(rows, safePage, safeSize, total == null ? 0 : total);
    }

    @Transactional
    public LoungeVisit logLoungeVisit(LoungeVisitCreate dto) {
        Integer known = jdbc.queryForObject("SELECT COUNT(*) FROM lounge_visits WHERE lounge_name = ?", Integer.class, dto.loungeName());
        if (known == null || known == 0) throw new BadRequestException("Unknown lounge: " + dto.loungeName());
        Integer passenger = jdbc.queryForObject("SELECT COUNT(*) FROM passengers WHERE passenger_id = ?", Integer.class, dto.passengerId());
        if (passenger == null || passenger == 0) throw new ResourceNotFoundException("Passenger not found ID: " + dto.passengerId());
        Long id = jdbc.queryForObject("INSERT INTO lounge_visits (lounge_name, passenger_id) VALUES (?, ?) RETURNING visit_id", Long.class,
                dto.loungeName(), dto.passengerId());
        return jdbc.query(
                "SELECT v.visit_id, v.lounge_name, t.first_name, t.last_name, p.pnr_code, f.flight_number FROM lounge_visits v "
                + "JOIN passengers p ON p.passenger_id = v.passenger_id JOIN travelers t ON t.traveler_id = p.traveler_id "
                + "JOIN flights f ON f.flight_id = p.flight_id WHERE v.visit_id = ?",
                (rs, i) -> new LoungeVisit(rs.getLong(1), rs.getString(2), rs.getString(3) + " " + rs.getString(4), rs.getString(5), rs.getString(6)),
                id).get(0);
    }
}
