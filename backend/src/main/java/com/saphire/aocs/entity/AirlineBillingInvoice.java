package com.saphire.aocs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "airline_billing_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirlineBillingInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "invoice_number", length = 50, nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    @Column(name = "billing_period_start", nullable = false)
    private LocalDate billingPeriodStart;

    @Column(name = "billing_period_end", nullable = false)
    private LocalDate billingPeriodEnd;

    @Column(name = "total_amount_usd", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmountUsd;

    @Column(name = "payment_status", length = 20, nullable = false)
    private String paymentStatus;

    // @JsonIgnore: AirlineBillingInvoice is returned directly by AirlineBillingController (no
    // DTO), so Jackson would otherwise call this getter during serialization and trigger this
    // LAZY collection outside the request's transaction -- currently masked by open-in-view,
    // which is being turned off (see application.properties). The invoice's line items are
    // already returned separately, under their own key, by getInvoiceDetails().
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<InvoiceLineItem> lineItems;
}
