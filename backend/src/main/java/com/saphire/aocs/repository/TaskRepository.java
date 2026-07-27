package com.saphire.aocs.repository;

import com.saphire.aocs.entity.TurnaroundTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TurnaroundTask, Long> {

    List<TurnaroundTask> findByFlight_FlightId(Long flightId);

    List<TurnaroundTask> findByStatus(String status);

    List<TurnaroundTask> findByAssignedUser_UserId(Long userId);
}
