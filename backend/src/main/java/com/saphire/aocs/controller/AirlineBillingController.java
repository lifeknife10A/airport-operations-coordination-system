package com.saphire.aocs.controller;

import com.saphire.aocs.dto.InvoiceGenerateDTO;
import com.saphire.aocs.entity.AirlineBillingInvoice;
import com.saphire.aocs.entity.InvoiceLineItem;
import com.saphire.aocs.service.AirlineBillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// Financial data (invoices, per-line charges) -- restricted to the role whose job this actually
// is, plus admin oversight. Any authenticated staff account could previously read every airline's
// billing details.
@RestController
@RequestMapping({"/api/billing", "/api/v1/billing"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('AIRLINE_BILLING_CLERK', 'SYSTEM_ADMINISTRATOR')")
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
    public ResponseEntity<AirlineBillingInvoice> generateInvoice(@Valid @RequestBody InvoiceGenerateDTO dto) {
        AirlineBillingInvoice invoice = billingService.generateInvoice(
                dto.getAirlineId(), dto.getStartDate(), dto.getEndDate(), dto.getTotalAmountUsd(), dto.getInvoiceNumber());
        return new ResponseEntity<>(invoice, HttpStatus.CREATED);
    }
}
