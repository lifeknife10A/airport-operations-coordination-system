package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Stand;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StandRepository extends JpaRepository<Stand, Long> {

    Optional<Stand> findByStandNumber(String standNumber);

    /** SELECT ... FOR UPDATE. Serializes concurrent assignments to the same stand. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Stand s WHERE s.standId = :id")
    Optional<Stand> findByIdForUpdate(@Param("id") Long id);

    List<Stand> findByIsRemote(Boolean isRemote);

    List<Stand> findByHasJetbridge(Boolean hasJetbridge);
}
