package com.saphire.aocs.repository;

import com.saphire.aocs.entity.BagTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BagTagRepository extends JpaRepository<BagTag, Long> {
    Optional<BagTag> findByTagNumber(String tagNumber);
    List<BagTag> findByFlightFlightId(Long flightId);
    List<BagTag> findByPassengerPassengerId(Long passengerId);
}
