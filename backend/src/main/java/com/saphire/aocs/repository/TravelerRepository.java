package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Traveler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TravelerRepository extends JpaRepository<Traveler, Long> {
    Optional<Traveler> findByPassportNumber(String passportNumber);
}
