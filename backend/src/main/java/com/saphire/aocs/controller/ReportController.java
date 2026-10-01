package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ReportSummaryDTO;
import com.saphire.aocs.service.ReportExportService;
import com.saphire.aocs.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/reports", "/api/v1/reports"})
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ReportExportService reportExportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDTO> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @GetMapping({"/flight-movements/csv", "/export/flights-csv"})
    public ResponseEntity<byte[]> getFlightMovementsCsv() {
        byte[] bytes = reportExportService.exportFlightsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"saphire-flights-export.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER')")
    @GetMapping({"/gate-utilization/pdf", "/export/gates-pdf"})
    public ResponseEntity<byte[]> getGateUtilizationPdf() {
        byte[] bytes = reportExportService.exportGatesSummaryText();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"saphire-gates-report.txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'AIRLINE_BILLING_CLERK')")
    @GetMapping({"/airline-billing/excel", "/export/billing-excel"})
    public ResponseEntity<byte[]> getAirlineBillingExcel() {
        byte[] bytes = reportExportService.exportBillingInvoicesCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"saphire-billing-invoices.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}
