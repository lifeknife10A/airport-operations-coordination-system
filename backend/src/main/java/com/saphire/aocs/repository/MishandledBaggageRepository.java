package com.saphire.aocs.repository;

import com.saphire.aocs.entity.MishandledBaggage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MishandledBaggageRepository extends JpaRepository<MishandledBaggage, Long> {
    Optional<MishandledBaggage> findByClaimNumber(String claimNumber);
    List<MishandledBaggage> findByStatus(String status);
}
