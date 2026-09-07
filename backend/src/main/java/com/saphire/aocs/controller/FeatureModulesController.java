package com.saphire.aocs.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeatureModulesController {

    // Feature 7: Aircraft Auxiliary Power (GPU/PCA) Utility Monitor
    private final List<Map<String, Object>> gpuLogs = Collections.synchronizedList(new ArrayList<>());

    @GetMapping("/utilities/gpu")
    public ResponseEntity<List<Map<String, Object>>> getGpuLogs() {
        return ResponseEntity.ok(gpuLogs);
    }

    @PostMapping("/utilities/gpu")
    public ResponseEntity<Map<String, Object>> logGpuUsage(@RequestBody Map<String, Object> payload) {
        payload.put("loggedAt", ZonedDateTime.now().toString());
        payload.put("logId", gpuLogs.size() + 1L);
        gpuLogs.add(payload);
        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }

    // Feature 12: Interactive Terminal Incident Tracker
    private final List<Map<String, Object>> incidentTickets = Collections.synchronizedList(new ArrayList<>());

    @GetMapping("/incidents")
    public ResponseEntity<List<Map<String, Object>>> getIncidents() {
        return ResponseEntity.ok(incidentTickets);
    }

    @PostMapping("/incidents")
    public ResponseEntity<Map<String, Object>> createIncident(@RequestBody Map<String, Object> payload) {
        payload.put("ticketId", "INC-" + (incidentTickets.size() + 101));
        payload.put("status", "OPEN");
        payload.put("createdAt", ZonedDateTime.now().toString());
        incidentTickets.add(payload);
        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }

    @PutMapping("/incidents/{ticketId}/status")
    public ResponseEntity<Map<String, Object>> updateIncidentStatus(@PathVariable String ticketId, @RequestBody Map<String, String> statusPayload) {
        for (Map<String, Object> ticket : incidentTickets) {
            if (ticketId.equalsIgnoreCase(String.valueOf(ticket.get("ticketId")))) {
                ticket.put("status", statusPayload.get("status"));
                ticket.put("updatedAt", ZonedDateTime.now().toString());
                return ResponseEntity.ok(ticket);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Feature 13: Check-in Counter Allocation Planner
    private final List<Map<String, Object>> counterAllocations = Collections.synchronizedList(new ArrayList<>());

    @GetMapping("/checkin-counters")
    public ResponseEntity<List<Map<String, Object>>> getCheckinCounterAllocations() {
        return ResponseEntity.ok(counterAllocations);
    }

    @PostMapping("/checkin-counters")
    public ResponseEntity<Map<String, Object>> allocateCheckinCounter(@RequestBody Map<String, Object> payload) {
        payload.put("allocationId", counterAllocations.size() + 1L);
        payload.put("allocatedAt", ZonedDateTime.now().toString());
        counterAllocations.add(payload);
        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }

    // Feature 19: Shift Handover Bulletin Board
    private final List<Map<String, Object>> handoverNotes = Collections.synchronizedList(new ArrayList<>());

    @GetMapping("/handover-notes")
    public ResponseEntity<List<Map<String, Object>>> getHandoverNotes() {
        return ResponseEntity.ok(handoverNotes);
    }

    @PostMapping("/handover-notes")
    public ResponseEntity<Map<String, Object>> postHandoverNote(@RequestBody Map<String, Object> payload) {
        payload.put("noteId", handoverNotes.size() + 1L);
        payload.put("postedAt", ZonedDateTime.now().toString());
        handoverNotes.add(payload);
        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }
}
