package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Enforce Saphire Hub Constraint: Find all flights originating or terminating at SPH (airport_id = 1)
    @Query("SELECT f FROM Flight f WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1")
    List<Flight> findAllSaphireHubFlights();

    /**
     * High-performance Eager Fetch for Dashboard Grid avoiding N+1 queries.
     * Safe from Cartesian Product inflation because it joins strictly to-one associations 
     * (originAirport, destinationAirport, airline, aircraft).
     * Note: Do NOT add @OneToMany collections (e.g. tasks/delayLogs) to this fetch query without DISTINCT.
     */
    @Query("SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline JOIN FETCH f.aircraft WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1")
    List<Flight> findAllSaphireHubFlightsWithDetails();

    List<Flight> findByFlightStatus(String flightStatus);

    List<Flight> findByFlightNumberContainingIgnoreCase(String flightNumber);
}
