package com.saphire.aocs.service;

import com.saphire.aocs.entity.Airline;
import com.saphire.aocs.entity.AirlineBillingInvoice;
import com.saphire.aocs.entity.InvoiceLineItem;

import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.AirlineBillingInvoiceRepository;
import com.saphire.aocs.repository.AirlineRepository;
import com.saphire.aocs.repository.InvoiceLineItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AirlineBillingService {

    private final AirlineBillingInvoiceRepository invoiceRepository;
    private final InvoiceLineItemRepository lineItemRepository;
    private final AirlineRepository airlineRepository;

    @Transactional(readOnly = true)
    public List<AirlineBillingInvoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AirlineBillingInvoice getInvoiceById(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found ID: " + invoiceId));
    }

    @Transactional(readOnly = true)
    public List<InvoiceLineItem> getLineItemsByInvoiceId(Long invoiceId) {
        return lineItemRepository.findByInvoiceInvoiceId(invoiceId);
    }

    @Transactional
    public AirlineBillingInvoice generateInvoice(Long airlineId, LocalDate startDate, LocalDate endDate, BigDecimal totalAmountUsd, String invoiceNumber) {
        Airline airline = airlineRepository.findById(airlineId)
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found ID: " + airlineId));

        AirlineBillingInvoice invoice = AirlineBillingInvoice.builder()
                .invoiceNumber(invoiceNumber)
                .airline(airline)
                .billingPeriodStart(startDate)
                .billingPeriodEnd(endDate)
                .totalAmountUsd(totalAmountUsd)
                .paymentStatus("UNPAID")
                .build();
        return invoiceRepository.save(invoice);
    }
}
