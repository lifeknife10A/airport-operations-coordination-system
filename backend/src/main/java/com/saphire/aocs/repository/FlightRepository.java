package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    @Query("SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline JOIN FETCH f.aircraft LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1")
    List<Flight> findAllSaphireHubFlightsWithAllDetails();

    /**
     * Same query as above but with real SQL-level pagination (LIMIT/OFFSET via Pageable) instead
     * of loading every Saphire Hub flight into memory. Safe to paginate despite the JOIN FETCHes
     * because they're all to-one associations -- no collection fetch, so no in-memory-pagination
     * warning applies. countQuery is supplied explicitly rather than relying on Spring Data to
     * strip the JOIN FETCH clauses itself.
     */
    @Query(
        value = "SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline JOIN FETCH f.aircraft LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1",
        countQuery = "SELECT COUNT(f) FROM Flight f WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1"
    )
    Page<Flight> findAllSaphireHubFlightsWithAllDetails(Pageable pageable);

    /**
     * Same filter/eager-fetch/pagination contract as findAllSaphireHubFlightsWithAllDetails(Pageable)
     * above, plus a free-text match against flight number, airline name, gate number, or either
     * airport's IATA code -- covers what the public Flight Tracker search box lets travelers type
     * (flight number, carrier, or route).
     */
    @Query(
        value = "SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline JOIN FETCH f.aircraft LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department "
            + "WHERE (f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1) "
            + "AND (LOWER(f.flightNumber) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.airline.airlineName) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.gate.gateNumber) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.originAirport.iataCode) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.destinationAirport.iataCode) LIKE LOWER(CONCAT('%', :query, '%')))",
        countQuery = "SELECT COUNT(f) FROM Flight f "
            + "WHERE (f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1) "
            + "AND (LOWER(f.flightNumber) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.airline.airlineName) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.gate.gateNumber) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.originAirport.iataCode) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(f.destinationAirport.iataCode) LIKE LOWER(CONCAT('%', :query, '%')))"
    )
    Page<Flight> searchSaphireHubFlights(@org.springframework.data.repository.query.Param("query") String query, Pageable pageable);

    List<Flight> findByFlightStatus(String flightStatus);

    List<Flight> findByFlightNumberContainingIgnoreCase(String flightNumber);

    List<Flight> findByGate_GateId(Long gateId);

    List<Flight> findByStand_StandId(Long standId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT f FROM Flight f WHERE f.flightId = :id")
    java.util.Optional<Flight> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);

    /** Live or upcoming hub flights, boarding first, then delayed, then scheduled (newest first). */
    @Query("SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline "
            + "JOIN FETCH f.aircraft a JOIN FETCH a.aircraftType LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department "
            + "WHERE f.flightStatus IN ('BOARDING', 'DELAYED', 'SCHEDULED') "
            + "AND (f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1) "
            + "ORDER BY CASE f.flightStatus WHEN 'BOARDING' THEN 0 WHEN 'DELAYED' THEN 1 ELSE 2 END, f.scheduledDepartureTime DESC")
    List<Flight> findOperationalFlights(Pageable pageable);

    @Query("SELECT f.flightStatus, COUNT(f) FROM Flight f WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1 GROUP BY f.flightStatus")
    List<Object[]> countHubFlightsByStatus();

    /** Live/upcoming flights parked at a gate whose wingspan limit is below the aircraft's wingspan. */
    @Query(value = "SELECT f FROM Flight f JOIN FETCH f.gate g JOIN FETCH f.aircraft a JOIN FETCH a.aircraftType t JOIN FETCH f.airline "
            + "WHERE f.flightStatus IN ('BOARDING', 'DELAYED', 'SCHEDULED') AND g.maxWingspanMeters < t.wingspanMeters "
            + "ORDER BY CASE f.flightStatus WHEN 'BOARDING' THEN 0 WHEN 'DELAYED' THEN 1 ELSE 2 END, f.scheduledDepartureTime DESC",
            countQuery = "SELECT COUNT(f) FROM Flight f JOIN f.gate g JOIN f.aircraft a JOIN a.aircraftType t "
            + "WHERE f.flightStatus IN ('BOARDING', 'DELAYED', 'SCHEDULED') AND g.maxWingspanMeters < t.wingspanMeters")
    Page<Flight> findWingspanConflicts(Pageable pageable);

    /**
     * Pairs of live/upcoming flights on the same gate whose departures are under 15 minutes apart.
     * Columns: flight1 id, flight1 number, flight2 number, gate number, flight1 departure.
     */
    @Query(value = "SELECT f1.flight_id, f1.flight_number, f2.flight_number, g.gate_number, f1.scheduled_departure_time "
            + "FROM flights f1 JOIN flights f2 ON f1.gate_id = f2.gate_id AND f1.flight_id < f2.flight_id "
            + "AND ABS(EXTRACT(EPOCH FROM (f1.scheduled_departure_time - f2.scheduled_departure_time))) < 900 "
            + "JOIN gates g ON g.gate_id = f1.gate_id "
            + "WHERE f1.flight_status IN ('BOARDING', 'DELAYED', 'SCHEDULED') AND f2.flight_status IN ('BOARDING', 'DELAYED', 'SCHEDULED') "
            + "ORDER BY f1.scheduled_departure_time DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> findGateOverlaps(@org.springframework.data.repository.query.Param("limit") int limit);

    @Query(value = "SELECT COUNT(*) FROM flights f1 JOIN flights f2 ON f1.gate_id = f2.gate_id AND f1.flight_id < f2.flight_id "
            + "AND ABS(EXTRACT(EPOCH FROM (f1.scheduled_departure_time - f2.scheduled_departure_time))) < 900 "
            + "WHERE f1.flight_status IN ('BOARDING', 'DELAYED', 'SCHEDULED') AND f2.flight_status IN ('BOARDING', 'DELAYED', 'SCHEDULED')",
            nativeQuery = true)
    long countGateOverlaps();

    /**
     * Per-runway traffic: departures that are boarding or delayed, and inbound (airborne) arrivals.
     * Columns: runway id, "DEPARTURE" or "ARRIVAL", count.
     */
    @Query("SELECT f.runwayId, f.flightType, COUNT(f) FROM Flight f WHERE f.runwayId IS NOT NULL AND "
            + "((f.flightType = 'DEPARTURE' AND f.flightStatus IN ('BOARDING', 'DELAYED')) "
            + "OR (f.flightType = 'ARRIVAL' AND f.flightStatus = 'AIRBORNE')) GROUP BY f.runwayId, f.flightType")
    List<Object[]> countRunwayTraffic();

    @Query(value = "SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport JOIN FETCH f.airline "
            + "JOIN FETCH f.aircraft a JOIN FETCH a.aircraftType LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand s LEFT JOIN FETCH f.department "
            + "WHERE (f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1) AND f.flightType = :type "
            + "AND (:concourse = '' OR s.concourse = :concourse) "
            + "AND (:q = '' OR LOWER(f.flightNumber) LIKE CONCAT('%', :q, '%') OR LOWER(f.airline.airlineName) LIKE CONCAT('%', :q, '%') "
            + "OR LOWER(f.originAirport.iataCode) LIKE CONCAT('%', :q, '%') OR LOWER(f.destinationAirport.iataCode) LIKE CONCAT('%', :q, '%') "
            + "OR LOWER(f.originAirport.city) LIKE CONCAT('%', :q, '%') OR LOWER(f.destinationAirport.city) LIKE CONCAT('%', :q, '%')) "
            + "ORDER BY f.scheduledDepartureTime DESC, f.flightId DESC",
            countQuery = "SELECT COUNT(f) FROM Flight f LEFT JOIN f.stand s "
            + "WHERE (f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1) AND f.flightType = :type "
            + "AND (:concourse = '' OR s.concourse = :concourse) "
            + "AND (:q = '' OR LOWER(f.flightNumber) LIKE CONCAT('%', :q, '%') OR LOWER(f.airline.airlineName) LIKE CONCAT('%', :q, '%') "
            + "OR LOWER(f.originAirport.iataCode) LIKE CONCAT('%', :q, '%') OR LOWER(f.destinationAirport.iataCode) LIKE CONCAT('%', :q, '%') "
            + "OR LOWER(f.originAirport.city) LIKE CONCAT('%', :q, '%') OR LOWER(f.destinationAirport.city) LIKE CONCAT('%', :q, '%'))")
    Page<Flight> searchSchedule(@org.springframework.data.repository.query.Param("type") String type,
                                @org.springframework.data.repository.query.Param("concourse") String concourse,
                                @org.springframework.data.repository.query.Param("q") String q, Pageable pageable);

    @Query("SELECT f.flightType, COUNT(f) FROM Flight f WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1 GROUP BY f.flightType")
    List<Object[]> countHubFlightsByType();

    /** Columns: flight id, carousel number. */
    @Query(value = "SELECT c.flight_id, c.carousel_number FROM baggage_carousels c WHERE c.flight_id IN (:flightIds)", nativeQuery = true)
    List<Object[]> findCarouselsForFlights(@org.springframework.data.repository.query.Param("flightIds") java.util.Collection<Long> flightIds);
}
