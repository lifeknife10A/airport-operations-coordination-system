package com.saphire.aocs.service;

import com.saphire.aocs.dto.*;
import com.saphire.aocs.entity.DelayLog;
import com.saphire.aocs.entity.DelayLogId;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.FlightStatus;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DelayLogRepository;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

/** Read models and the delay log behind the AOCC controller dashboard. */
@Slf4j
@Service
@RequiredArgsConstructor
public class FlightOperationsService {

    private static final int MAX_PAGE_SIZE = 100;

    private static final String DELAY_SELECT =
            "SELECT d.flight_id, f.flight_number, oa.iata_code AS origin, da.iata_code AS destination, d.delay_seq_no, "
            + "d.delay_code, c.category, c.description, d.delay_minutes "
            + "FROM delay_logs d JOIN flights f ON f.flight_id = d.flight_id "
            + "JOIN airports oa ON oa.airport_id = f.origin_airport_id JOIN airports da ON da.airport_id = f.destination_airport_id "
            + "JOIN delay_codes c ON c.delay_code = d.delay_code ";

    private final JdbcTemplate jdbc;
    private final FlightRepository flightRepository;
    private final TaskRepository taskRepository;
    private final DelayLogRepository delayLogRepository;
    private final FlightService flightService;
    private final TurnaroundTaskService turnaroundTaskService;

    private DelayEntryDTO mapDelay(java.sql.ResultSet rs, int i) throws java.sql.SQLException {
        return DelayEntryDTO.builder()
                .flightId(rs.getLong("flight_id")).flightNumber(rs.getString("flight_number"))
                .route(rs.getString("origin") + " → " + rs.getString("destination"))
                .seqNo(rs.getInt("delay_seq_no")).delayCode(rs.getString("delay_code"))
                .category(rs.getString("category")).description(rs.getString("description"))
                .delayMinutes(rs.getInt("delay_minutes")).build();
    }

    @Transactional(readOnly = true)
    public FlightOperationsDTO getOperations(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));
        List<TaskDTO> tasks = taskRepository.findByFlightIdWithAssociations(flightId).stream()
                .sorted(java.util.Comparator.comparing(t -> t.getScheduledStart(),
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
                .map(turnaroundTaskService::mapToDTO).collect(Collectors.toList());
        List<DelayEntryDTO> delays = jdbc.query(DELAY_SELECT + "WHERE d.flight_id = ? ORDER BY d.delay_seq_no", this::mapDelay, flightId);
        Long passes = jdbc.queryForObject("SELECT COUNT(*) FROM boarding_passes WHERE flight_id = ?", Long.class, flightId);
        return FlightOperationsDTO.builder()
                .flight(flightService.mapToDTO(flight)).tasks(tasks).delays(delays).boardingPasses(passes == null ? 0 : passes)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<DelayEntryDTO> getDelaysPage(int page, int size) {
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        int safePage = Math.max(0, page);
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM delay_logs", Long.class);
        long totalElements = total == null ? 0 : total;
        // Most recent departures first so the freshest delays are on page one.
        List<DelayEntryDTO> rows = jdbc.query(DELAY_SELECT
                        + "ORDER BY f.scheduled_departure_time DESC, d.flight_id DESC, d.delay_seq_no LIMIT ? OFFSET ?",
                this::mapDelay, safeSize, (long) safePage * safeSize);
        return PagedResponseDTO.<DelayEntryDTO>builder()
                .content(rows).page(safePage).size(safeSize).totalElements(totalElements)
                .totalPages((int) Math.ceil(totalElements / (double) safeSize)).build();
    }

    @Transactional(readOnly = true)
    public List<DelayCodeDTO> getDelayCodes() {
        return jdbc.query("SELECT delay_code, category, description FROM delay_codes ORDER BY delay_code",
                (rs, i) -> new DelayCodeDTO(rs.getString(1), rs.getString(2), rs.getString(3)));
    }

    /**
     * Records a delay against a flight and pushes its estimated departure back by the same amount.
     * The flight moves to DELAYED when its current status allows it; otherwise the status is left
     * alone (the delay is still logged).
     */
    @Transactional
    public DelayEntryDTO logDelay(Long flightId, DelayCreateDTO dto) {
        String code = dto.getDelayCode().trim().toUpperCase();
        Integer known = jdbc.queryForObject("SELECT COUNT(*) FROM delay_codes WHERE delay_code = ?", Integer.class, code);
        if (known == null || known == 0) {
            throw new BadRequestException("Unknown delay code: " + code);
        }
        Flight flight = flightRepository.findByIdForUpdate(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));

        int nextSeq = delayLogRepository.findMaxSeqForFlight(flightId) + 1;
        delayLogRepository.saveAndFlush(DelayLog.builder()
                .id(new DelayLogId(flightId, nextSeq)).flight(flight)
                .delayCode(code).delayMinutes(dto.getDelayMinutes()).build());

        ZonedDateTime base = flight.getEstimatedDepartureTime() != null ? flight.getEstimatedDepartureTime() : flight.getScheduledDepartureTime();
        if (base != null) {
            flight.setEstimatedDepartureTime(base.plusMinutes(dto.getDelayMinutes()));
        }
        try {
            if (!"DELAYED".equals(flight.getFlightStatus())
                    && FlightStatus.valueOf(flight.getFlightStatus()).canTransitionTo(FlightStatus.DELAYED)) {
                flight.setFlightStatus(FlightStatus.DELAYED.name());
            }
        } catch (IllegalArgumentException ignored) {
            // an unrecognised stored status is left as it is
        }
        flightRepository.saveAndFlush(flight);
        log.info("Delay {} (+{} min) logged for flight {} (id {})", code, dto.getDelayMinutes(), flight.getFlightNumber(), flightId);

        return jdbc.query(DELAY_SELECT + "WHERE d.flight_id = ? AND d.delay_seq_no = ?", this::mapDelay, flightId, nextSeq).get(0);
    }
}
