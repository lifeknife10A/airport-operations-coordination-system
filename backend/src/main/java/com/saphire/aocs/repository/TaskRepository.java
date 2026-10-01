package com.saphire.aocs.repository;

import com.saphire.aocs.entity.TurnaroundTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TurnaroundTask, Long> {

    List<TurnaroundTask> findByFlight_FlightId(Long flightId);

    List<TurnaroundTask> findByStatus(String status);

    List<TurnaroundTask> findByAssignedUser_UserId(Long userId);

    /**
     * flight is @ManyToOne LAZY and assignedUser is @ManyToOne EAGER; mapToDTO() dereferences
     * both for every row (flight number, assigned user name), which without JOIN FETCH is one
     * extra SELECT per association per row -- unlike FlightRepository's
     * findAllSaphireHubFlightsWithAllDetails(), which already joins its to-one associations in
     * one query. LEFT JOIN because assignedUser is nullable (an unassigned task).
     */
    @Query("SELECT t FROM TurnaroundTask t JOIN FETCH t.flight LEFT JOIN FETCH t.assignedUser")
    List<TurnaroundTask> findAllWithAssociations();

    @Query("SELECT t FROM TurnaroundTask t JOIN FETCH t.flight LEFT JOIN FETCH t.assignedUser WHERE t.status = :status")
    List<TurnaroundTask> findByStatusWithAssociations(@org.springframework.data.repository.query.Param("status") String status);

    @Query("SELECT t FROM TurnaroundTask t JOIN FETCH t.flight LEFT JOIN FETCH t.assignedUser WHERE t.flight.flightId = :flightId")
    List<TurnaroundTask> findByFlightIdWithAssociations(@org.springframework.data.repository.query.Param("flightId") Long flightId);
}
