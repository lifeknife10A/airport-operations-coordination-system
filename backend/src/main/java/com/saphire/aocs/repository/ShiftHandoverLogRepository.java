package com.saphire.aocs.repository;

import com.saphire.aocs.entity.ShiftHandoverLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftHandoverLogRepository extends JpaRepository<ShiftHandoverLog, Long> {

    List<ShiftHandoverLog> findByDepartmentDepartmentIdOrderByOutgoingSignoffTimestampDesc(Long departmentId);

    Page<ShiftHandoverLog> findByStatusOrderByOutgoingSignoffTimestampDesc(String status, Pageable pageable);

    @Query("SELECT s FROM ShiftHandoverLog s WHERE s.status = 'PENDING_ACKNOWLEDGEMENT' ORDER BY s.outgoingSignoffTimestamp DESC")
    List<ShiftHandoverLog> findPendingHandovers();

    @Query("SELECT s FROM ShiftHandoverLog s ORDER BY s.outgoingSignoffTimestamp DESC")
    Page<ShiftHandoverLog> findAllLatest(Pageable pageable);
}
