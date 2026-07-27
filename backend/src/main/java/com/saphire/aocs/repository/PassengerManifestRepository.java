package com.saphire.aocs.repository;

import com.saphire.aocs.entity.PassengerManifest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassengerManifestRepository extends JpaRepository<PassengerManifest, Long> {
    List<PassengerManifest> findByFlight_FlightId(Long flightId);
}
