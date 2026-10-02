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

    /**
     * One page of the task board, optionally narrowed by status and by flight number / task name.
     * Statuses that need attention (BLOCKED, IN_PROGRESS) sort first, then newest scheduled start.
     * Both filters are non-null strings ('' = no filter) so the query has no untyped null parameters.
     */
    @Query(value = "SELECT t FROM TurnaroundTask t JOIN FETCH t.flight f LEFT JOIN FETCH t.assignedUser "
            + "WHERE (:status = '' OR t.status = :status) "
            + "AND (:q = '' OR LOWER(f.flightNumber) LIKE CONCAT('%', :q, '%') OR LOWER(t.taskName) LIKE CONCAT('%', :q, '%')) "
            + "ORDER BY CASE t.status WHEN 'BLOCKED' THEN 0 WHEN 'IN_PROGRESS' THEN 1 WHEN 'PENDING' THEN 2 ELSE 3 END, "
            + "t.scheduledStart DESC, t.taskId DESC",
            countQuery = "SELECT COUNT(t) FROM TurnaroundTask t JOIN t.flight f "
            + "WHERE (:status = '' OR t.status = :status) "
            + "AND (:q = '' OR LOWER(f.flightNumber) LIKE CONCAT('%', :q, '%') OR LOWER(t.taskName) LIKE CONCAT('%', :q, '%'))")
    org.springframework.data.domain.Page<TurnaroundTask> searchBoard(
            @org.springframework.data.repository.query.Param("status") String status,
            @org.springframework.data.repository.query.Param("q") String q,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT t.status, COUNT(t) FROM TurnaroundTask t GROUP BY t.status")
    List<Object[]> countByStatus();

    /** Flights that have work under way or blocked, most recently scheduled first. */
    @Query("SELECT t.flight.flightId FROM TurnaroundTask t WHERE t.status IN ('IN_PROGRESS', 'BLOCKED') "
            + "GROUP BY t.flight.flightId ORDER BY MAX(t.scheduledStart) DESC, t.flight.flightId DESC")
    List<Long> findActiveTurnaroundFlightIds(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT t FROM TurnaroundTask t JOIN FETCH t.flight LEFT JOIN FETCH t.assignedUser WHERE t.flight.flightId IN :flightIds")
    List<TurnaroundTask> findByFlightIdsWithAssociations(@org.springframework.data.repository.query.Param("flightIds") java.util.Collection<Long> flightIds);

    /** Active ramp agents with their in-progress and open (pending, in progress, blocked) task counts. */
    @Query("SELECT u.userId, u.name, d.departmentName, "
            + "COALESCE(SUM(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 ELSE 0 END), 0), COUNT(t), u.username "
            + "FROM User u LEFT JOIN u.department d LEFT JOIN TurnaroundTask t "
            + "ON t.assignedUser = u AND t.status IN ('PENDING', 'IN_PROGRESS', 'BLOCKED') "
            + "WHERE u.role.roleName = 'RAMP_AGENT' AND u.status = 'ACTIVE' "
            + "GROUP BY u.userId, u.name, u.username, d.departmentName ORDER BY COUNT(t) ASC, u.name ASC, u.username ASC")
    List<Object[]> findRampStaffWorkload();
}
