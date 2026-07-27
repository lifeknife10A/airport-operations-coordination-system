package com.saphire.aocs.repository;

import com.saphire.aocs.entity.FuelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FuelRequestRepository extends JpaRepository<FuelRequest, Long> {
    Optional<FuelRequest> findByFlight_FlightId(Long flightId);
    List<FuelRequest> findByStatus(String status);
}
