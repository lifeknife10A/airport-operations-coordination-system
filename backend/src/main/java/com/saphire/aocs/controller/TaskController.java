package com.saphire.aocs.controller;

import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.dto.TaskCreateDTO;
import com.saphire.aocs.dto.TaskDTO;
import com.saphire.aocs.service.TurnaroundTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TurnaroundTaskService turnaroundTaskService;

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<TaskDTO>> getTasksByFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(turnaroundTaskService.getTasksByFlight(flightId));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        TaskDTO created = turnaroundTaskService.createTask(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody StatusUpdateDTO dto) {
        TaskDTO updated = turnaroundTaskService.updateTaskStatus(taskId, dto.getStatus(), dto.getUserId(), dto.getNotes());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{taskId}/assign")
    public ResponseEntity<TaskDTO> assignTaskUser(
            @PathVariable Long taskId,
            @RequestParam Long userId) {
        TaskDTO updated = turnaroundTaskService.assignTaskUser(taskId, userId);
        return ResponseEntity.ok(updated);
    }
}
