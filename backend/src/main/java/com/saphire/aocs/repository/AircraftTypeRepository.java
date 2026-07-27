package com.saphire.aocs.repository;

import com.saphire.aocs.entity.AircraftType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AircraftTypeRepository extends JpaRepository<AircraftType, Long> {
    Optional<AircraftType> findByTypecode(String typecode);
}
