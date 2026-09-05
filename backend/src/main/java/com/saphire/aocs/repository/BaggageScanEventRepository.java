package com.saphire.aocs.repository;

import com.saphire.aocs.entity.BaggageScanEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BaggageScanEventRepository extends JpaRepository<BaggageScanEvent, Long> {
    List<BaggageScanEvent> findByBagTagBagTagIdOrderByScanTimestampDesc(Long bagTagId);
    List<BaggageScanEvent> findByBagTagTagNumberOrderByScanTimestampDesc(String tagNumber);
}
