package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ReportSummaryDTO;
import com.saphire.aocs.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDTO> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }
}
