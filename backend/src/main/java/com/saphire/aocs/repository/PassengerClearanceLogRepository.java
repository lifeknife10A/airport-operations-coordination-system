package com.saphire.aocs.repository;

import com.saphire.aocs.entity.PassengerClearanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassengerClearanceLogRepository extends JpaRepository<PassengerClearanceLog, Long> {
    List<PassengerClearanceLog> findByPassengerPassengerIdOrderByScanTimestampDesc(Long passengerId);
    List<PassengerClearanceLog> findByClearanceStatus(String clearanceStatus);
}
