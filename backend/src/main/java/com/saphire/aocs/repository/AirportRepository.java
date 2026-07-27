package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {

    Optional<Airport> findByIataCode(String iataCode);

    Optional<Airport> findByIcaoCode(String icaoCode);
}
