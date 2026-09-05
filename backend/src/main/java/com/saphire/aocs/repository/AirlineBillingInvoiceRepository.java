package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AirlineBillingInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AirlineBillingInvoiceRepository extends JpaRepository<AirlineBillingInvoice, Long> {
    Optional<AirlineBillingInvoice> findByInvoiceNumber(String invoiceNumber);
    List<AirlineBillingInvoice> findByAirlineAirlineId(Long airlineId);
    List<AirlineBillingInvoice> findByPaymentStatus(String paymentStatus);
}
