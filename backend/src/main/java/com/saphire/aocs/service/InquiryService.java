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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final OperationalInquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final TravelerRepository travelerRepository;

    @Transactional
    public InquiryResponseDTO createInquiry(InquiryCreateDTO dto) {
        String ticketNumber = "INQ-2026-" + String.format("%05d", (int) (Math.random() * 90000) + 10000);

        Flight flight = null;
        if (dto.getLinkedFlightId() != null) {
            flight = flightRepository.findById(dto.getLinkedFlightId()).orElse(null);
        }

        Traveler traveler = null;
        if (dto.getLinkedTravelerId() != null) {
            traveler = travelerRepository.findById(dto.getLinkedTravelerId()).orElse(null);
        }

        OperationalInquiry inquiry = OperationalInquiry.builder()
                .ticketNumber(ticketNumber)
                .fullName(dto.getFullName())
                .emailAddress(dto.getEmailAddress())
                .phoneNumber(dto.getPhoneNumber())
                .category(dto.getCategory() != null ? dto.getCategory() : "GENERAL_PASSENGER_ASSISTANCE")
                .inquiryDetails(dto.getInquiryDetails())
                .priority(dto.getPriority() != null ? dto.getPriority() : "NORMAL")
                .status("OPEN")
                .sourceChannel(dto.getSourceChannel() != null ? dto.getSourceChannel() : "WEB_PORTAL")
                .assignedDepartment("PASSENGER_SERVICES")
                .linkedFlight(flight)
                .linkedTraveler(traveler)
                .build();

        OperationalInquiry saved = inquiryRepository.save(inquiry);
        return mapToDTO(saved);
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
