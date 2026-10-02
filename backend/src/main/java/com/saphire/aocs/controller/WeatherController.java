package com.saphire.aocs.controller;

import com.saphire.aocs.dto.WeatherReportDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.util.List;

/** Public: the latest recorded weather observation, with its timestamp so staleness is visible. */
@RestController
@RequestMapping({"/api/weather", "/api/v1/weather"})
public class WeatherController {

    private final JdbcTemplate jdbc;

    public WeatherController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/latest")
    public ResponseEntity<WeatherReportDTO> latest() {
        List<WeatherReportDTO> rows = jdbc.query(
                "SELECT visibility_meters, wind_speed_knots, temperature_celsius, runway_condition, observation_time "
                + "FROM weather_reports ORDER BY observation_time DESC, report_id DESC LIMIT 1",
                (rs, i) -> new WeatherReportDTO(rs.getInt(1), rs.getInt(2), rs.getBigDecimal(3), rs.getString(4),
                        rs.getTimestamp(5).toInstant().atZone(ZoneId.systemDefault())));
        return rows.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(rows.get(0));
    }
}
