package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ShiftHandoverAckDTO;
import com.saphire.aocs.dto.ShiftHandoverCreateDTO;
import com.saphire.aocs.dto.ShiftHandoverDTO;
import com.saphire.aocs.service.ShiftHandoverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/shift-handover", "/api/v1/shift-handover"})
@RequiredArgsConstructor
public class ShiftHandoverController {

    private final ShiftHandoverService shiftHandoverService;

    @GetMapping("/pending")
    public ResponseEntity<List<ShiftHandoverDTO>> getPendingHandovers() {
        return ResponseEntity.ok(shiftHandoverService.getPendingHandovers());
    }

    @GetMapping
    public ResponseEntity<Page<ShiftHandoverDTO>> getAllHandovers(
            @PageableDefault(size = 20, sort = "outgoingSignoffTimestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(shiftHandoverService.getAllHandovers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftHandoverDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(shiftHandoverService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ShiftHandoverDTO> submitHandover(@RequestBody ShiftHandoverCreateDTO dto) {
        ShiftHandoverDTO created = shiftHandoverService.createHandover(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<ShiftHandoverDTO> acknowledgeHandover(
            @PathVariable Long id,
            @RequestBody ShiftHandoverAckDTO dto) {
        return ResponseEntity.ok(shiftHandoverService.acknowledgeHandover(id, dto));
    }
}
