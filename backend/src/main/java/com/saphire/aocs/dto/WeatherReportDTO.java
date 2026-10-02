package com.saphire.aocs.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

/** The most recent weather observation at the airport. Wind direction is not recorded. */
public record WeatherReportDTO(int visibilityMeters, int windSpeedKnots, BigDecimal temperatureCelsius,
                               String runwayCondition, ZonedDateTime observedAt) {}
