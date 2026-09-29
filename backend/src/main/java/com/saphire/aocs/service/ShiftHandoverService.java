package com.saphire.aocs.service;

import com.saphire.aocs.dto.ShiftHandoverAckDTO;
import com.saphire.aocs.dto.ShiftHandoverCreateDTO;
import com.saphire.aocs.dto.ShiftHandoverDTO;
import com.saphire.aocs.entity.Department;
import com.saphire.aocs.entity.ShiftHandoverLog;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DepartmentRepository;
import com.saphire.aocs.repository.ShiftHandoverLogRepository;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftHandoverService {

    private final ShiftHandoverLogRepository handoverRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ShiftHandoverDTO> getPendingHandovers() {
        return handoverRepository.findPendingHandovers().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ShiftHandoverDTO> getAllHandovers(Pageable pageable) {
        return handoverRepository.findAllLatest(pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public ShiftHandoverDTO getById(Long id) {
        ShiftHandoverLog log = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift handover log not found with ID: " + id));
        return mapToDTO(log);
    }

    @Transactional
    public ShiftHandoverDTO createHandover(ShiftHandoverCreateDTO dto) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        User outSup = userRepository.findById(dto.getOutgoingSupervisorId())
                .orElseThrow(() -> new ResourceNotFoundException("Outgoing supervisor not found with ID: " + dto.getOutgoingSupervisorId()));

        User inSup = userRepository.findById(dto.getIncomingSupervisorId())
                .orElseThrow(() -> new ResourceNotFoundException("Incoming supervisor not found with ID: " + dto.getIncomingSupervisorId()));

        ShiftHandoverLog log = ShiftHandoverLog.builder()
                .shiftCode(dto.getShiftCode())
                .department(dept)
                .outgoingSupervisor(outSup)
                .incomingSupervisor(inSup)
                .totalFlightsHandled(dto.getTotalFlightsHandled() != null ? dto.getTotalFlightsHandled() : 0)
                .delayedFlightsCount(dto.getDelayedFlightsCount() != null ? dto.getDelayedFlightsCount() : 0)
                .averageTurnaroundMinutes(dto.getAverageTurnaroundMinutes() != null ? dto.getAverageTurnaroundMinutes() : new BigDecimal("45.00"))
                .groundIncidentsCount(dto.getGroundIncidentsCount() != null ? dto.getGroundIncidentsCount() : 0)
                .criticalEventsSummary(dto.getCriticalEventsSummary())
                .unresolvedEquipmentIssues(dto.getUnresolvedEquipmentIssues())
                .pendingFlightWatches(dto.getPendingFlightWatches())
                .safetyWeatherAdvisories(dto.getSafetyWeatherAdvisories())
                .status("PENDING_ACKNOWLEDGEMENT")
                .outgoingSignoffTimestamp(OffsetDateTime.now())
                .build();

        ShiftHandoverLog saved = handoverRepository.save(log);
        return mapToDTO(saved);
    }

    @Transactional
    public ShiftHandoverDTO acknowledgeHandover(Long id, ShiftHandoverAckDTO dto) {
        ShiftHandoverLog log = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift handover log not found with ID: " + id));

        if (dto.getIncomingSupervisorId() != null) {
            User inSup = userRepository.findById(dto.getIncomingSupervisorId()).orElse(log.getIncomingSupervisor());
            log.setIncomingSupervisor(inSup);
        }

        log.setIncomingSignoffTimestamp(OffsetDateTime.now());
        log.setStatus("ACKNOWLEDGED_ACTIVE");

        ShiftHandoverLog saved = handoverRepository.save(log);
        return mapToDTO(saved);
    }

    private ShiftHandoverDTO mapToDTO(ShiftHandoverLog entity) {
        return ShiftHandoverDTO.builder()
                .handoverId(entity.getHandoverId())
                .shiftCode(entity.getShiftCode())
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getDepartmentId() : null)
                .departmentName(entity.getDepartment() != null ? entity.getDepartment().getDepartmentName() : null)
                .outgoingSupervisorId(entity.getOutgoingSupervisor() != null ? entity.getOutgoingSupervisor().getUserId() : null)
                .outgoingSupervisorName(entity.getOutgoingSupervisor() != null ? entity.getOutgoingSupervisor().getName() : null)
                .incomingSupervisorId(entity.getIncomingSupervisor() != null ? entity.getIncomingSupervisor().getUserId() : null)
                .incomingSupervisorName(entity.getIncomingSupervisor() != null ? entity.getIncomingSupervisor().getName() : null)
                .totalFlightsHandled(entity.getTotalFlightsHandled())
                .delayedFlightsCount(entity.getDelayedFlightsCount())
                .averageTurnaroundMinutes(entity.getAverageTurnaroundMinutes())
                .groundIncidentsCount(entity.getGroundIncidentsCount())
                .criticalEventsSummary(entity.getCriticalEventsSummary())
                .unresolvedEquipmentIssues(entity.getUnresolvedEquipmentIssues())
                .pendingFlightWatches(entity.getPendingFlightWatches())
                .safetyWeatherAdvisories(entity.getSafetyWeatherAdvisories())
                .outgoingSignoffTimestamp(entity.getOutgoingSignoffTimestamp())
                .incomingSignoffTimestamp(entity.getIncomingSignoffTimestamp())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
