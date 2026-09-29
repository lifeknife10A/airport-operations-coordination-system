package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Runway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RunwayRepository extends JpaRepository<Runway, Long> {

    Optional<Runway> findByRunwayCode(String runwayCode);
}
