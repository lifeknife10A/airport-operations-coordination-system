package com.saphire.aocs.repository;

import com.saphire.aocs.entity.BoardingPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardingPassRepository extends JpaRepository<BoardingPass, Long> {

    Optional<BoardingPass> findByBarcodeData(String barcodeData);

    Optional<BoardingPass> findByTicketNumber(String ticketNumber);

    Optional<BoardingPass> findByPassengerPassengerId(Long passengerId);

    List<BoardingPass> findByFlightFlightId(Long flightId);

    @Query("SELECT bp.seatNumber FROM BoardingPass bp WHERE bp.flight.flightId = :flightId")
    List<String> findOccupiedSeatsByFlightId(@Param("flightId") Long flightId);

    @Query("SELECT COALESCE(MAX(bp.sequenceNumber), 0) FROM BoardingPass bp WHERE bp.flight.flightId = :flightId")
    Integer findMaxSequenceNumberByFlightId(@Param("flightId") Long flightId);
}
