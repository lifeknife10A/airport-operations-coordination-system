package com.saphire.aocs.controller;

import com.saphire.aocs.dto.ReportSummaryDTO;
import com.saphire.aocs.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDTO> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }

    @GetMapping("/flight-movements/csv")
    public ResponseEntity<byte[]> getFlightMovementsCsv() {
        String csv = "# SAPHIRE INTERNATIONAL AIRPORT (SPH) - FLIGHT MOVEMENT SUMMARY\n" +
                "# Generated: " + ZonedDateTime.now() + "\n" +
                "Flight Number,Airline,Aircraft Type,Route,Gate,Scheduled Time,Status,Passengers,SLA Compliance\n" +
                "SPH-102,Saphire Airways,Airbus A350-900,SPH -> LHR (London),Gate B12,22:45 UTC,BOARDING,284,96.4%\n" +
                "SPH-204,Saphire Airways,Boeing 777-300ER,SPH -> DXB (Dubai),Gate A04,23:10 UTC,SCHEDULED,312,99.1%\n" +
                "SPH-308,Saphire Airways,Boeing 787-9,SPH -> LAX (Los Angeles),Gate C22,23:35 UTC,AIRBORNE,248,98.5%\n" +
                "SPH-809,Saphire Airways,Airbus A330-300,SPH -> JFK (New York),Gate A10,23:50 UTC,DELAYED,275,84.2%\n" +
                "SPH-412,Saphire Airways,Airbus A321neo,CDG -> SPH (Paris),Gate B08,00:15 UTC,ON_BLOCK,192,97.8%\n";

        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"flight-movements-summary.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @GetMapping("/gate-utilization/pdf")
    public ResponseEntity<byte[]> getGateUtilizationPdf() {
        String pdf = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
                "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
                "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n" +
                "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n" +
                "5 0 obj\n<< /Length 250 >>\nstream\nBT\n/F1 14 Tf\n50 720 Td\n(SAPHIRE INTERNATIONAL AIRPORT - GATE & STAND UTILIZATION) Tj\n" +
                "/F1 10 Tf\n0 -30 Td\n(Official aerodrome report generated: " + ZonedDateTime.now() + ") Tj\nET\nendstream\nendobj\n" +
                "xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \n0000000293 00000 n \n" +
                "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n600\n%%EOF";

        byte[] bytes = pdf.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"gate-stand-utilization-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }

    @GetMapping("/airline-billing/excel")
    public ResponseEntity<byte[]> getAirlineBillingExcel() {
        String xml = "<?xml version=\"1.0\"?>\n" +
                "<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\n" +
                " xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">\n" +
                " <Worksheet ss:Name=\"Airline Billing\">\n" +
                "  <Table>\n" +
                "   <Row><Cell><Data ss:Type=\"String\">Carrier</Data></Cell><Cell><Data ss:Type=\"String\">Flight</Data></Cell><Cell><Data ss:Type=\"String\">Total ($)</Data></Cell></Row>\n" +
                "   <Row><Cell><Data ss:Type=\"String\">Saphire Airways</Data></Cell><Cell><Data ss:Type=\"String\">SPH-102</Data></Cell><Cell><Data ss:Type=\"Number\">2860</Data></Cell></Row>\n" +
                "   <Row><Cell><Data ss:Type=\"String\">Air India</Data></Cell><Cell><Data ss:Type=\"String\">AI-203</Data></Cell><Cell><Data ss:Type=\"Number\">2570</Data></Cell></Row>\n" +
                "  </Table>\n" +
                " </Worksheet>\n" +
                "</Workbook>";

        byte[] bytes = xml.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"airline-billing-manifest.xls\"")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(bytes);
    }
}
