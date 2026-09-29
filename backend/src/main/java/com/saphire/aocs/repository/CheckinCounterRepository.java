package com.saphire.aocs.repository;

import com.saphire.aocs.entity.CheckinCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckinCounterRepository extends JpaRepository<CheckinCounter, Long> {

    Optional<CheckinCounter> findByCounterNumber(String counterNumber);

    List<CheckinCounter> findByTerminal(String terminal);

    List<CheckinCounter> findByConcourse(String concourse);

    List<CheckinCounter> findByAllocatedAirlineAirlineId(Long airlineId);
}
