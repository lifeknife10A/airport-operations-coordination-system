package com.saphire.aocs.service;

import com.saphire.aocs.dto.ReportSummaryDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.TurnaroundTask;
import com.saphire.aocs.repository.DelayLogRepository;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final FlightRepository flightRepository;
    private final TaskRepository taskRepository;
    private final DelayLogRepository delayLogRepository;

    @Transactional(readOnly = true)
    public ReportSummaryDTO getSummaryReport() {
        List<Flight> flights = flightRepository.findAllSaphireHubFlights();
        long totalFlights = flights.size();

        long landedFlights = flights.stream()
                .filter(f -> "LANDED".equalsIgnoreCase(f.getFlightStatus()) || "ON_BLOCK".equalsIgnoreCase(f.getFlightStatus()))
                .count();

        List<com.saphire.aocs.entity.DelayLog> allDelayLogs = delayLogRepository.findAll();
        java.util.Set<Long> delayedFlightIds = allDelayLogs.stream()
                .map(d -> d.getFlight().getFlightId())
                .collect(java.util.stream.Collectors.toSet());

        long delayedFlights = flights.stream()
                .filter(f -> "DELAYED".equalsIgnoreCase(f.getFlightStatus()) || delayedFlightIds.contains(f.getFlightId()))
                .count();

        double onTimeRate = totalFlights > 0 ? ((double) (totalFlights - delayedFlights) / totalFlights) * 100.0 : 100.0;

        List<TurnaroundTask> tasks = taskRepository.findAll();
        long totalTasksCompleted = tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();
        long pendingTasks = tasks.stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))
                .count();

        return ReportSummaryDTO.builder()
                .totalFlights(totalFlights)
                .landedFlights(landedFlights)
                .delayedFlights(delayedFlights)
                .onTimeDepartureRate(Math.round(onTimeRate * 10.0) / 10.0)
                .totalTasksCompleted(totalTasksCompleted)
                .pendingTasks(pendingTasks)
                .build();
    }
}
