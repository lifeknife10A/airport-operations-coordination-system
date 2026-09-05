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
public class BorderControlService {

    private final TravelerRepository travelerRepository;
    private final PassengerRepository passengerRepository;
    private final PassengerClearanceLogRepository passengerClearanceLogRepository;
    private final ImmigrationRecordRepository immigrationRecordRepository;

    @Transactional(readOnly = true)
    public Traveler getTravelerByPassport(String passportNumber) {
        return travelerRepository.findByPassportNumber(passportNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Traveler not found for passport: " + passportNumber));
    }

    @Transactional(readOnly = true)
    public List<Passenger> getPassengerHistoryByPassport(String passportNumber) {
        return passengerRepository.findByTravelerPassportNumber(passportNumber);
    }

    @Transactional
    public PassengerClearanceLog logClearance(Long passengerId, String clearanceStatus, String denialReason, String verificationMethod, Long boardingPassId, Long checkpointId) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found ID: " + passengerId));

        PassengerClearanceLog log = PassengerClearanceLog.builder()
                .scanTimestamp(ZonedDateTime.now())
                .clearanceStatus(clearanceStatus)
                .denialReason(denialReason)
                .verificationMethod(verificationMethod)
                .passenger(passenger)
                .boardingPassId(boardingPassId)
                .checkpointId(checkpointId)
                .build();
        return passengerClearanceLogRepository.save(log);
    }

    @Transactional
    public ImmigrationRecord logImmigrationStamp(Long passengerId, String visaType, String stampNumber, Boolean biometricFacialMatched, String clearanceType) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found ID: " + passengerId));

        ImmigrationRecord record = ImmigrationRecord.builder()
                .visaType(visaType)
                .stampNumber(stampNumber)
                .biometricFacialMatched(biometricFacialMatched)
                .clearanceType(clearanceType)
                .passenger(passenger)
                .build();
        return immigrationRecordRepository.save(record);
    }
}
