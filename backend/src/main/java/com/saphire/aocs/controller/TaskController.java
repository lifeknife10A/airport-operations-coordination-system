package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ActiveTurnaroundDTO;
import com.saphire.aocs.dto.PagedResponseDTO;
import com.saphire.aocs.dto.StaffWorkloadDTO;
import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.dto.TaskCreateDTO;
import com.saphire.aocs.dto.TaskDTO;
import com.saphire.aocs.service.TurnaroundTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/tasks", "/api/v1/tasks"})
@RequiredArgsConstructor
public class TaskController {

    private final TurnaroundTaskService turnaroundTaskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(turnaroundTaskService.getAllTasks(status));
    }

    @GetMapping("/page")
    public ResponseEntity<PagedResponseDTO<TaskDTO>> getTaskBoardPage(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(turnaroundTaskService.getTaskBoardPage(status, query, page, size));
    }

    @GetMapping("/active-turnarounds")
    public ResponseEntity<List<ActiveTurnaroundDTO>> getActiveTurnarounds(@RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(turnaroundTaskService.getActiveTurnarounds(limit));
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GROUND_HANDLING_SUPERVISOR')")
    @GetMapping("/staff")
    public ResponseEntity<List<StaffWorkloadDTO>> getRampStaffWorkload() {
        return ResponseEntity.ok(turnaroundTaskService.getRampStaffWorkload());
    }

    @GetMapping("/summary")
    public ResponseEntity<java.util.Map<String, Long>> getTaskStatusCounts() {
        return ResponseEntity.ok(turnaroundTaskService.getTaskStatusCounts());
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<TaskDTO>> getTasksByFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(turnaroundTaskService.getTasksByFlight(flightId));
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GROUND_HANDLING_SUPERVISOR')")
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        TaskDTO created = turnaroundTaskService.createTask(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GROUND_HANDLING_SUPERVISOR', 'RAMP_AGENT')")
    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody StatusUpdateDTO dto) {
        TaskDTO updated = turnaroundTaskService.updateTaskStatus(taskId, dto.getStatus(), dto.getUserId(), dto.getNotes());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'GROUND_HANDLING_SUPERVISOR')")
    @PutMapping("/{taskId}/assign")
    public ResponseEntity<TaskDTO> assignTaskUser(
            @PathVariable Long taskId,
            @RequestParam Long userId) {
        TaskDTO updated = turnaroundTaskService.assignTaskUser(taskId, userId);
        return ResponseEntity.ok(updated);
    }
}
