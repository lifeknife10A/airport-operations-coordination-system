package com.saphire.aocs.service;

import com.saphire.aocs.dto.InquiryCreateDTO;
import com.saphire.aocs.dto.InquiryResponseDTO;
import com.saphire.aocs.dto.InquiryStatusUpdateDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.OperationalInquiry;
import com.saphire.aocs.entity.Traveler;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.OperationalInquiryRepository;
import com.saphire.aocs.repository.TravelerRepository;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.saphire.aocs.dto.InquiryPublicStatusDTO;
import java.security.SecureRandom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class InquiryService {

    private final OperationalInquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final TravelerRepository travelerRepository;

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * @param staff true when the caller is a logged-in staff member. Anonymous submissions come from
     *              the public contact form, so they may not choose their own priority or channel or
     *              attach the ticket to an arbitrary traveler record -- those are forced to the
     *              defaults / ignored.
     */
    @Transactional
    public InquiryResponseDTO createInquiry(InquiryCreateDTO dto, boolean staff) {
        String ticketNumber = generateUniqueTicketNumber();

        Flight flight = null;
        if (dto.getLinkedFlightId() != null) {
            flight = flightRepository.findById(dto.getLinkedFlightId()).orElse(null);
        }

        Traveler traveler = null;
        if (staff && dto.getLinkedTravelerId() != null) {
            traveler = travelerRepository.findById(dto.getLinkedTravelerId()).orElse(null);
        }

        String priority = staff && dto.getPriority() != null ? dto.getPriority() : "NORMAL";
        String sourceChannel = staff && dto.getSourceChannel() != null ? dto.getSourceChannel() : "WEB_PORTAL";

        OperationalInquiry inquiry = OperationalInquiry.builder()
                .ticketNumber(ticketNumber)
                .fullName(dto.getFullName())
                .emailAddress(dto.getEmailAddress())
                .phoneNumber(dto.getPhoneNumber())
                .category(dto.getCategory() != null ? dto.getCategory() : "GENERAL_PASSENGER_ASSISTANCE")
                .inquiryDetails(dto.getInquiryDetails())
                .priority(priority)
                .status("OPEN")
                .sourceChannel(sourceChannel)
                .assignedDepartment("PASSENGER_SERVICES")
                .linkedFlight(flight)
                .linkedTraveler(traveler)
                .build();

        OperationalInquiry saved = inquiryRepository.save(inquiry);
        log.info("Inquiry {} submitted ({}, category {}, priority {})", saved.getTicketNumber(),
                staff ? "staff" : "public", saved.getCategory(), saved.getPriority());
        return mapToDTO(saved);
    }

    /** Random 5-digit suffix (as before) but from SecureRandom, re-drawn until it doesn't collide. */
    private String generateUniqueTicketNumber() {
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = "INQ-2026-" + String.format("%05d", 10000 + RANDOM.nextInt(90000));
            if (!inquiryRepository.existsByTicketNumber(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not allocate a unique inquiry ticket number");
    }

    @Transactional(readOnly = true)
    public InquiryPublicStatusDTO getPublicStatusByTicketNumber(String ticketNumber) {
        OperationalInquiry i = inquiryRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with ticket: " + ticketNumber));
        return InquiryPublicStatusDTO.builder()
                .ticketNumber(i.getTicketNumber())
                .category(i.getCategory())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .resolvedAt(i.getResolvedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public InquiryResponseDTO getByTicketNumber(String ticketNumber) {
        OperationalInquiry inquiry = inquiryRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with ticket: " + ticketNumber));
        return mapToDTO(inquiry);
    }

    @Transactional(readOnly = true)
    public InquiryResponseDTO getById(Long id) {
        OperationalInquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with ID: " + id));
        return mapToDTO(inquiry);
    }

    @Transactional(readOnly = true)
    public Page<InquiryResponseDTO> searchInquiries(String status, String category, String department, String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return inquiryRepository.findByTicketNumberContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(
                    search.trim(), search.trim(), search.trim(), pageable).map(this::mapToDTO);
        }
        return inquiryRepository.findWithFilters(status, category, department, pageable).map(this::mapToDTO);
    }

    @Transactional
    public InquiryResponseDTO updateInquiryStatus(Long id, InquiryStatusUpdateDTO dto) {
        OperationalInquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with ID: " + id));

        if (dto.getStatus() != null) {
            inquiry.setStatus(dto.getStatus());
            if ("RESOLVED".equalsIgnoreCase(dto.getStatus()) || "CLOSED".equalsIgnoreCase(dto.getStatus())) {
                inquiry.setResolvedAt(OffsetDateTime.now());
            }
        }
        if (dto.getResolutionNotes() != null) {
            inquiry.setResolutionNotes(dto.getResolutionNotes());
        }
        if (dto.getAssignedDepartment() != null) {
            inquiry.setAssignedDepartment(dto.getAssignedDepartment());
        }
        if (dto.getAssignedStaffUserId() != null) {
            User staff = userRepository.findById(dto.getAssignedStaffUserId()).orElse(null);
            inquiry.setAssignedStaffUser(staff);
        }

        OperationalInquiry saved = inquiryRepository.save(inquiry);
        return mapToDTO(saved);
    }

    private InquiryResponseDTO mapToDTO(OperationalInquiry entity) {
        return InquiryResponseDTO.builder()
                .inquiryId(entity.getInquiryId())
                .ticketNumber(entity.getTicketNumber())
                .fullName(entity.getFullName())
                .emailAddress(entity.getEmailAddress())
                .phoneNumber(entity.getPhoneNumber())
                .category(entity.getCategory())
                .inquiryDetails(entity.getInquiryDetails())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .sourceChannel(entity.getSourceChannel())
                .assignedDepartment(entity.getAssignedDepartment())
                .assignedStaffUserId(entity.getAssignedStaffUser() != null ? entity.getAssignedStaffUser().getUserId() : null)
                .assignedStaffName(entity.getAssignedStaffUser() != null ? entity.getAssignedStaffUser().getName() : null)
                .linkedFlightId(entity.getLinkedFlight() != null ? entity.getLinkedFlight().getFlightId() : null)
                .linkedFlightNumber(entity.getLinkedFlight() != null ? entity.getLinkedFlight().getFlightNumber() : null)
                .linkedTravelerId(entity.getLinkedTraveler() != null ? entity.getLinkedTraveler().getTravelerId() : null)
                .resolutionNotes(entity.getResolutionNotes())
                .resolvedAt(entity.getResolvedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
