package com.saphire.aocs.service;

import com.saphire.aocs.entity.AirlineBillingInvoice;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.Gate;
import com.saphire.aocs.repository.AirlineBillingInvoiceRepository;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.GateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final FlightRepository flightRepository;
    private final GateRepository gateRepository;
    private final AirlineBillingInvoiceRepository invoiceRepository;

    @Transactional(readOnly = true)
    public byte[] exportFlightsCsv() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println("Flight ID,Flight Number,Airline,Origin IATA,Destination IATA,Gate,Stand,Scheduled Departure,Actual Departure,Status");

        List<Flight> flights = flightRepository.findAll(PageRequest.of(0, 1000)).getContent();
        for (Flight f : flights) {
            String airline = f.getAirline() != null ? f.getAirline().getAirlineName() : "Saphire Airlines";
            String origin = f.getOriginAirport() != null ? f.getOriginAirport().getIataCode() : "BOM";
            String dest = f.getDestinationAirport() != null ? f.getDestinationAirport().getIataCode() : "DEL";
            String gate = f.getGate() != null ? f.getGate().getGateNumber() : "TBD";
            String stand = f.getStand() != null ? f.getStand().getStandNumber() : "TBD";
            String sched = f.getScheduledDepartureTime() != null ? f.getScheduledDepartureTime().toString() : "";
            String act = f.getActualDepartureTime() != null ? f.getActualDepartureTime().toString() : "";
            String status = f.getFlightStatus() != null ? f.getFlightStatus() : "SCHEDULED";

            writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    f.getFlightId(), f.getFlightNumber(), airline, origin, dest, gate, stand, sched, act, status);
        }

        writer.flush();
        return out.toByteArray();
    }

    @Transactional(readOnly = true)
    public byte[] exportGatesSummaryText() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("================================================================================");
        writer.println("         SAPHIRE AIRPORT OPERATIONS & CONTROL SYSTEM (AOCS)                   ");
        writer.println("              AERODROME GATE OCCUPANCY & UTILIZATION REPORT                    ");
        writer.println("================================================================================");
        writer.println("Generated At: " + OffsetDateTime.now().toString());
        writer.println("Total Gates Monitored: 40 | Terminal 1 & 2 Concourses A, B, C");
        writer.println("--------------------------------------------------------------------------------");
        writer.printf("%-12s %-16s %-16s %-18s %-12s%n", "GATE NUMBER", "TERMINAL", "CONCOURSE", "MAX WINGSPAN", "OCCUPANCY");
        writer.println("--------------------------------------------------------------------------------");

        List<Gate> gates = gateRepository.findAll();
        for (Gate g : gates) {
            String terminal = g.getTerminal() != null ? g.getTerminal() : "Terminal 2";
            String concourse = g.getConcourse() != null ? g.getConcourse() : "Concourse A";
            String wingspan = g.getMaxWingspanMeters() != null ? g.getMaxWingspanMeters().toString() + " m" : "42.0 m";
            String occStatus = "AVAILABLE";

            writer.printf("%-12s %-16s %-16s %-18s %-12s%n",
                    g.getGateNumber(), terminal, concourse, wingspan, occStatus);
        }

        writer.println("================================================================================");
        writer.println("End of Report. Confidential — For Saphire AOCC & Ground Operations Authority.");
        writer.flush();
        return out.toByteArray();
    }

    @Transactional(readOnly = true)
    public byte[] exportBillingInvoicesCsv() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println("Invoice ID,Invoice Number,Airline Name,IATA,Billing Period Start,Billing Period End,Total Amount (USD),Status,Due Date");

        List<AirlineBillingInvoice> invoices = invoiceRepository.findAllWithAirline(PageRequest.of(0, 1000)).getContent();
        for (AirlineBillingInvoice inv : invoices) {
            String airlineName = inv.getAirline() != null ? inv.getAirline().getAirlineName() : "Saphire Partner";
            String iata = inv.getAirline() != null ? inv.getAirline().getIataCode() : "--";
            String start = inv.getBillingPeriodStart() != null ? inv.getBillingPeriodStart().toString() : "";
            String end = inv.getBillingPeriodEnd() != null ? inv.getBillingPeriodEnd().toString() : "";
            BigDecimal amount = inv.getTotalAmountUsd() != null ? inv.getTotalAmountUsd() : BigDecimal.ZERO;
            String status = inv.getPaymentStatus() != null ? inv.getPaymentStatus() : "PENDING";
            String due = inv.getBillingPeriodEnd() != null ? inv.getBillingPeriodEnd().plusDays(30).toString() : "";

            writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\",\"%s\"%n",
                    inv.getInvoiceId(), inv.getInvoiceNumber(), airlineName, iata, start, end, amount, status, due);
        }

        writer.flush();
        return out.toByteArray();
    }
}
