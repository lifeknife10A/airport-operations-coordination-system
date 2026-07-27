package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {

    Optional<Gate> findByGateNumber(String gateNumber);
}
