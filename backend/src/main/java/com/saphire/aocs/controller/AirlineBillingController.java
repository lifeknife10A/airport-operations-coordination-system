package com.saphire.aocs.controller;

import com.saphire.aocs.entity.AirlineBillingInvoice;
import com.saphire.aocs.entity.InvoiceLineItem;
import com.saphire.aocs.service.AirlineBillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class AirlineBillingController {

    private final AirlineBillingService billingService;

    @GetMapping("/invoices")
    public ResponseEntity<List<AirlineBillingInvoice>> getAllInvoices() {
        return ResponseEntity.ok(billingService.getAllInvoices());
    }

    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<Map<String, Object>> getInvoiceDetails(@PathVariable Long invoiceId) {
        AirlineBillingInvoice invoice = billingService.getInvoiceById(invoiceId);
        List<InvoiceLineItem> lineItems = billingService.getLineItemsByInvoiceId(invoiceId);
        return ResponseEntity.ok(Map.of(
                "invoice", invoice,
                "lineItems", lineItems
        ));
    }

    @PostMapping("/generate-invoice")
    public ResponseEntity<AirlineBillingInvoice> generateInvoice(@RequestBody Map<String, Object> payload) {
        Long airlineId = Long.valueOf(payload.get("airlineId").toString());
        LocalDate startDate = LocalDate.parse(payload.get("startDate").toString());
        LocalDate endDate = LocalDate.parse(payload.get("endDate").toString());
        BigDecimal amount = new BigDecimal(payload.get("totalAmountUsd").toString());
        String invoiceNumber = (String) payload.get("invoiceNumber");

        AirlineBillingInvoice invoice = billingService.generateInvoice(airlineId, startDate, endDate, amount, invoiceNumber);
        return new ResponseEntity<>(invoice, HttpStatus.CREATED);
    }
}
