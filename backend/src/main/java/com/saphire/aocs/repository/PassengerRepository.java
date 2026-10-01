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

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Passenger p WHERE " +
            "LOWER(p.pnrCode) = LOWER(:query) OR " +
            "LOWER(p.traveler.passportNumber) = LOWER(:query) OR " +
            "LOWER(CONCAT(p.traveler.firstName, ' ', p.traveler.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Passenger> searchPassenger(String query);
}
