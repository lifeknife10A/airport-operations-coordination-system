package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AirlineBillingInvoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AirlineBillingInvoiceRepository extends JpaRepository<AirlineBillingInvoice, Long> {
    Optional<AirlineBillingInvoice> findByInvoiceNumber(String invoiceNumber);
    List<AirlineBillingInvoice> findByAirlineAirlineId(Long airlineId);
    List<AirlineBillingInvoice> findByPaymentStatus(String paymentStatus);

    /**
     * Same rows as findAll(Pageable), but with `airline` (@ManyToOne EAGER) joined in one query
     * instead of one extra SELECT per invoice -- the CSV export was issuing up to 1000 of those.
     */
    @Query(value = "SELECT i FROM AirlineBillingInvoice i JOIN FETCH i.airline",
           countQuery = "SELECT COUNT(i) FROM AirlineBillingInvoice i")
    Page<AirlineBillingInvoice> findAllWithAirline(Pageable pageable);
}
