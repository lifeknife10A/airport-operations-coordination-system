package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Stand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StandRepository extends JpaRepository<Stand, Long> {

    Optional<Stand> findByStandNumber(String standNumber);

    List<Stand> findByIsRemote(Boolean isRemote);

    List<Stand> findByHasJetbridge(Boolean hasJetbridge);
}
