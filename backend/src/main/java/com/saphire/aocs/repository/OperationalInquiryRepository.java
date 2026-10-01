package com.saphire.aocs.repository;

import com.saphire.aocs.entity.OperationalInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperationalInquiryRepository extends JpaRepository<OperationalInquiry, Long> {

    Optional<OperationalInquiry> findByTicketNumber(String ticketNumber);

    boolean existsByTicketNumber(String ticketNumber);

    Page<OperationalInquiry> findByStatus(String status, Pageable pageable);

    Page<OperationalInquiry> findByCategory(String category, Pageable pageable);

    Page<OperationalInquiry> findByTicketNumberContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(
            String ticket, String name, String email, Pageable pageable);

    @Query("SELECT i FROM OperationalInquiry i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:department IS NULL OR i.assignedDepartment = :department)")
    Page<OperationalInquiry> findWithFilters(
            @Param("status") String status,
            @Param("category") String category,
            @Param("department") String department,
            Pageable pageable);
}
