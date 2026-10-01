package com.saphire.aocs.service;

import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Was entirely inline in UserController (repository injected straight into the controller, every
 * other controller in this codebase goes through a service). Also NOTE: updateUserStatus() below
 * does not, and cannot, actually change anything persistent -- users has no status/active column
 * in the entity or the live database schema. "Suspending" a user here has always been cosmetic:
 * the endpoint validates the request and returns success, but there is nothing in the database
 * for the SUSPENDED value to change. Making suspension real needs a migration adding the column
 * and, for it to mean anything, AuthService.login() checking it -- flagged as a gap, not silently
 * built here, since it's a schema/feature decision rather than a response-shape cleanup.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private static final long PROTECTED_ROOT_ADMIN_USER_ID = 10L;
    private static final String PROTECTED_ROOT_ADMIN_USERNAME = "admin";

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUserStatus(Long id, UserStatusUpdateDTO dto) {
        String newStatus = dto.getStatus() != null ? dto.getStatus().toUpperCase() : "ACTIVE";

        if (id.equals(PROTECTED_ROOT_ADMIN_USER_ID) && "SUSPENDED".equals(newStatus)) {
            throw new BadRequestException(
                    "Administrative security policy: Root administrator accounts cannot be suspended.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (PROTECTED_ROOT_ADMIN_USERNAME.equalsIgnoreCase(user.getUsername()) && "SUSPENDED".equals(newStatus)) {
            throw new BadRequestException(
                    "Administrative security policy: System Administrator cannot suspend their own operational account.");
        }

        log.info("User status update requested: user {} ({}) -> {} (not persisted -- users has no status column)",
                user.getUserId(), user.getUsername(), newStatus);

        return toDTO(user);
    }

    private UserResponseDTO toDTO(User u) {
        return UserResponseDTO.builder()
                .userId(u.getUserId())
                .username(u.getUsername())
                .name(u.getName())
                .role(u.getRole() != null ? u.getRole().getRoleName() : "STAFF")
                .department(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "GENERAL")
                .status("ACTIVE")
                .build();
    }
}
