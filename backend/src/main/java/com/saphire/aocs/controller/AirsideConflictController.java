package com.saphire.aocs.controller;

import com.saphire.aocs.dto.AirsideConflictsDTO;
import com.saphire.aocs.service.AirsideConflictService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/airside/conflicts", "/api/v1/airside/conflicts"})
@RequiredArgsConstructor
public class AirsideConflictController {

    private final AirsideConflictService airsideConflictService;

    @GetMapping
    public ResponseEntity<AirsideConflictsDTO> getConflicts(@RequestParam(defaultValue = "25") int limit) {
        return ResponseEntity.ok(airsideConflictService.getConflicts(limit));
    }
}
