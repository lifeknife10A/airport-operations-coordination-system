package com.saphire.aocs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saphire.aocs.dto.StatusUpdateDTO;
import com.saphire.aocs.dto.TaskDTO;
import com.saphire.aocs.exception.GlobalExceptionHandler;
import com.saphire.aocs.service.TurnaroundTaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TurnaroundTaskService turnaroundTaskService;

    @InjectMocks
    private TaskController taskController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(taskController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getTasksByFlight_ShouldReturnTasks() throws Exception {
        TaskDTO task = TaskDTO.builder()
                .taskId(1L)
                .flightId(101L)
                .taskName("CLEANING")
                .status("PENDING")
                .build();

        when(turnaroundTaskService.getTasksByFlight(101L)).thenReturn(List.of(task));

        mockMvc.perform(get("/api/tasks/flight/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].taskId").value(1))
                .andExpect(jsonPath("$[0].taskName").value("CLEANING"));
    }

    @Test
    void updateTaskStatus_ShouldReturnUpdatedTask() throws Exception {
        StatusUpdateDTO dto = StatusUpdateDTO.builder()
                .status("IN_PROGRESS")
                .userId(5L)
                .build();

        TaskDTO updated = TaskDTO.builder()
                .taskId(1L)
                .status("IN_PROGRESS")
                .assignedUserId(5L)
                .build();

        when(turnaroundTaskService.updateTaskStatus(eq(1L), eq("IN_PROGRESS"), eq(5L), eq(null)))
                .thenReturn(updated);

        mockMvc.perform(put("/api/tasks/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
