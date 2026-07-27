package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft, Long> {

    Optional<Aircraft> findByRegistrationNumber(String registrationNumber);

    List<Aircraft> findByAirline_AirlineId(Long airlineId);
}
