package com.saphire.aocs.service;

import com.saphire.aocs.entity.*;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaggageService {

    private final BagTagRepository bagTagRepository;
    private final BaggageScanEventRepository baggageScanEventRepository;
    private final MishandledBaggageRepository mishandledBaggageRepository;
    private final PassengerRepository passengerRepository;

    @Transactional(readOnly = true)
    public BagTag getBagByTagNumber(String tagNumber) {
        return bagTagRepository.findByTagNumber(tagNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bag tag not found: " + tagNumber));
    }

    @Transactional(readOnly = true)
    public List<BaggageScanEvent> getScanHistoryByTagNumber(String tagNumber) {
        return baggageScanEventRepository.findByBagTagTagNumberOrderByScanTimestampDesc(tagNumber);
    }

    @Transactional
    public BaggageScanEvent addScanEvent(String tagNumber, String location) {
        BagTag bagTag = getBagByTagNumber(tagNumber);
        BaggageScanEvent scanEvent = BaggageScanEvent.builder()
                .bagTag(bagTag)
                .scanLocation(location)
                .scanTimestamp(ZonedDateTime.now())
                .build();
        return baggageScanEventRepository.save(scanEvent);
    }

    @Transactional
    public MishandledBaggage createMishandledReport(String claimNumber, String incidentType, String tagNumber, Long passengerId) {
        BagTag bagTag = getBagByTagNumber(tagNumber);
        Passenger passenger = passengerId != null
                ? passengerRepository.findById(passengerId)
                        .orElseThrow(() -> new ResourceNotFoundException("Passenger not found ID: " + passengerId))
                : bagTag.getPassenger();
        if (claimNumber == null || claimNumber.isBlank()) {
            claimNumber = "PIR-APP-" + (100000 + new java.security.SecureRandom().nextInt(900000));
        }

        MishandledBaggage report = MishandledBaggage.builder()
                .claimNumber(claimNumber)
                .incidentType(incidentType)
                .status("OPEN")
                .bagTag(bagTag)
                .passenger(passenger)
                .build();
        return mishandledBaggageRepository.save(report);
    }

    @Transactional(readOnly = true)
    public List<MishandledBaggage> getAllMishandledReports() {
        return mishandledBaggageRepository.findAll();
    }

    /** Newest first, one page at a time (there are a thousand of these). */
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<MishandledBaggage> getMishandledReportsPage(int page, int size) {
        return mishandledBaggageRepository.findAll(org.springframework.data.domain.PageRequest.of(
                Math.max(0, page), Math.min(Math.max(1, size), 100),
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "reportId")));
    }
}
