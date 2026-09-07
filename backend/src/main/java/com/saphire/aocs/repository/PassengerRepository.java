package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByFlightFlightId(Long flightId);
    List<Passenger> findByTravelerPassportNumber(String passportNumber);
    Optional<Passenger> findByPnrCode(String pnrCode);
}
