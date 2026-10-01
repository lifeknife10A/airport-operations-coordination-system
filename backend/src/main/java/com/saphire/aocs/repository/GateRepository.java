package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Gate;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {

    Optional<Gate> findByGateNumber(String gateNumber);

    /** SELECT ... FOR UPDATE. Serializes concurrent assignments to the same gate. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Gate g WHERE g.gateId = :id")
    Optional<Gate> findByIdForUpdate(@Param("id") Long id);
}
