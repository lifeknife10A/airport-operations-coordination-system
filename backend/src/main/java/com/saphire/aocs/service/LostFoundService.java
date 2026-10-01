package com.saphire.aocs.service;

import com.saphire.aocs.dto.LostFoundClaimDTO;
import com.saphire.aocs.dto.LostFoundReportDTO;
import com.saphire.aocs.dto.LostFoundResponseDTO;
import com.saphire.aocs.dto.LostFoundStatusDTO;
import com.saphire.aocs.entity.Flight;
import com.saphire.aocs.entity.LostFoundItem;
import com.saphire.aocs.entity.Traveler;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.FlightRepository;
import com.saphire.aocs.repository.LostFoundRepository;
import com.saphire.aocs.repository.TravelerRepository;
import com.saphire.aocs.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class LostFoundService {

    private final LostFoundRepository lostFoundRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final TravelerRepository travelerRepository;

    public LostFoundService(
            LostFoundRepository lostFoundRepository,
            FlightRepository flightRepository,
            UserRepository userRepository,
            TravelerRepository travelerRepository
    ) {
        this.lostFoundRepository = lostFoundRepository;
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
        this.travelerRepository = travelerRepository;
    }

    @Transactional(readOnly = true)
    public Page<LostFoundResponseDTO> searchItems(String query, String category, String status, int page, int size) {
        // Public endpoint: clamp so a caller can't ask for page -1 / size 0 (an unhandled 500) or
        // size=99999 (the whole table in one response).
        PageRequest pageRequest = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty()) ? category.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty()) ? status.trim() : null;

        return lostFoundRepository.searchItems(cleanQuery, cleanCategory, cleanStatus, pageRequest)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public LostFoundResponseDTO getByReferenceCode(String referenceCode) {
        LostFoundItem item = lostFoundRepository.findByReferenceCode(referenceCode)
                .orElseThrow(() -> new ResourceNotFoundException("Lost property not found with reference: " + referenceCode));
        return toDTO(item);
    }

    @Transactional(readOnly = true)
    public LostFoundResponseDTO getById(Long id) {
        LostFoundItem item = lostFoundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost property record not found with ID: " + id));
        return toDTO(item);
    }

    @Transactional
    public LostFoundResponseDTO reportItem(LostFoundReportDTO dto) {
        long totalItems = lostFoundRepository.count() + 1;
        String refCode = String.format("LF-2026-%04d", totalItems);

        Flight flight = null;
        if (dto.getFlightId() != null) {
            flight = flightRepository.findById(dto.getFlightId()).orElse(null);
        }

        Long userId = dto.getLoggedByUserId() != null ? dto.getLoggedByUserId() : 1L;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Logging user not found with ID: " + userId));

        String vaultLoc = dto.getStorageVaultLocation() != null && !dto.getStorageVaultLocation().trim().isEmpty()
                ? dto.getStorageVaultLocation().trim()
                : "Intake Desk Shelf 1";

        LostFoundItem item = new LostFoundItem();
        item.setReferenceCode(refCode);
        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setColorAndDescription(dto.getColorAndDescription());
        item.setFoundLocationType(dto.getFoundLocationType());
        item.setFoundLocationDetail(dto.getFoundLocationDetail());
        item.setTerminalId(dto.getTerminalId());
        item.setFlight(flight);
        item.setCheckpointId(dto.getCheckpointId());
        item.setStorageVaultLocation(vaultLoc);
        item.setStatus("LOGGED_SECURITY_INTAKE");
        item.setFinderType(dto.getFinderType());
        item.setLoggedByUser(user);

        LostFoundItem saved = lostFoundRepository.save(item);
        return toDTO(saved);
    }

    @Transactional
    public LostFoundResponseDTO updateStatus(Long itemId, LostFoundStatusDTO dto) {
        LostFoundItem item = lostFoundRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Lost property record not found with ID: " + itemId));

        item.setStatus(dto.getStatus());
        if (dto.getStorageVaultLocation() != null && !dto.getStorageVaultLocation().trim().isEmpty()) {
            item.setStorageVaultLocation(dto.getStorageVaultLocation().trim());
        }

        LostFoundItem saved = lostFoundRepository.save(item);
        return toDTO(saved);
    }

    @Transactional
    public LostFoundResponseDTO claimItem(Long itemId, LostFoundClaimDTO dto) {
        LostFoundItem item = lostFoundRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Lost property record not found with ID: " + itemId));

        Traveler traveler = null;
        if (dto.getClaimantTravelerId() != null) {
            traveler = travelerRepository.findById(dto.getClaimantTravelerId()).orElse(null);
        }

        Long releaseUserId = dto.getReleasedByUserId() != null ? dto.getReleasedByUserId() : 1L;
        User releaseUser = userRepository.findById(releaseUserId).orElse(null);

        item.setStatus("CLAIMED_RETURNED");
        item.setClaimantTraveler(traveler);
        item.setClaimantName(dto.getClaimantName());
        item.setClaimantContactEmail(dto.getClaimantContactEmail());
        item.setClaimantContactPhone(dto.getClaimantContactPhone());
        item.setClaimVerificationNotes(dto.getClaimVerificationNotes());
        item.setClaimedTimestamp(OffsetDateTime.now());
        item.setReleasedByUser(releaseUser);

        LostFoundItem saved = lostFoundRepository.save(item);
        return toDTO(saved);
    }

    public LostFoundResponseDTO toDTO(LostFoundItem item) {
        LostFoundResponseDTO dto = new LostFoundResponseDTO();
        dto.setItemId(item.getItemId());
        dto.setReferenceCode(item.getReferenceCode());
        dto.setItemName(item.getItemName());
        dto.setCategory(item.getCategory());
        dto.setColorAndDescription(item.getColorAndDescription());
        dto.setFoundLocationType(item.getFoundLocationType());
        dto.setFoundLocationDetail(item.getFoundLocationDetail());
        dto.setTerminalId(item.getTerminalId());
        dto.setFlightId(item.getFlight() != null ? item.getFlight().getFlightId() : null);
        dto.setFlightNumber(item.getFlight() != null ? item.getFlight().getFlightNumber() : null);
        dto.setCheckpointId(item.getCheckpointId());
        dto.setStorageVaultLocation(item.getStorageVaultLocation());
        dto.setStatus(item.getStatus());
        dto.setFinderType(item.getFinderType());
        dto.setLoggedByUserId(item.getLoggedByUser() != null ? item.getLoggedByUser().getUserId() : null);
        dto.setLoggedByUserName(item.getLoggedByUser() != null ? item.getLoggedByUser().getName() : null);
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        dto.setClaimantTravelerId(item.getClaimantTraveler() != null ? item.getClaimantTraveler().getTravelerId() : null);
        dto.setClaimantName(item.getClaimantName());
        dto.setClaimantContactEmail(item.getClaimantContactEmail());
        dto.setClaimantContactPhone(item.getClaimantContactPhone());
        dto.setClaimVerificationNotes(item.getClaimVerificationNotes());
        dto.setClaimedTimestamp(item.getClaimedTimestamp());
        dto.setReleasedByUserId(item.getReleasedByUser() != null ? item.getReleasedByUser().getUserId() : null);
        dto.setReleasedByUserName(item.getReleasedByUser() != null ? item.getReleasedByUser().getName() : null);
        return dto;
    }
}
