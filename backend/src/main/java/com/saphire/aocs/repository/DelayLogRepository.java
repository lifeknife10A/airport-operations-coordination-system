package com.saphire.aocs.repository;

import com.saphire.aocs.entity.DelayLog;
import com.saphire.aocs.entity.DelayLogId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DelayLogRepository extends JpaRepository<DelayLog, DelayLogId> {

    List<DelayLog> findByFlight_FlightId(Long flightId);

    List<DelayLog> findByDelayCode(String delayCode);
}
