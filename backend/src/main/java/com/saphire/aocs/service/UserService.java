package com.saphire.aocs.service;

import com.saphire.aocs.dto.UserCreateDTO;
import com.saphire.aocs.dto.UserCreatedResponseDTO;
import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.entity.Department;
import com.saphire.aocs.entity.Role;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DepartmentRepository;
import com.saphire.aocs.repository.RoleRepository;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Staff directory and account lifecycle. Suspension is persisted (users.status, V18): a suspended
 * user cannot log in, is rejected on any request still carrying a token, and has their active
 * sessions revoked the moment they are suspended.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private static final long PROTECTED_ROOT_ADMIN_USER_ID = 10L;
    private static final String PROTECTED_ROOT_ADMIN_USERNAME = "admin";
    private static final String PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final SessionService sessionService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUserStatus(Long id, UserStatusUpdateDTO dto, String actingUsername) {
        String newStatus = dto.getStatus() != null ? dto.getStatus().toUpperCase() : "ACTIVE";

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if ("SUSPENDED".equals(newStatus)) {
            if (id.equals(PROTECTED_ROOT_ADMIN_USER_ID) || PROTECTED_ROOT_ADMIN_USERNAME.equalsIgnoreCase(user.getUsername())) {
                throw new BadRequestException(
                        "Administrative security policy: Root administrator accounts cannot be suspended.");
            }
            if (actingUsername != null && actingUsername.equalsIgnoreCase(user.getUsername())) {
                throw new BadRequestException("You cannot suspend your own account.");
            }
        }

        user.setStatus(newStatus);
        userRepository.save(user);
        if ("SUSPENDED".equals(newStatus)) {
            sessionService.revokeAllForUser(user.getUserId(), "ACCOUNT_SUSPENDED");
        }
        log.info("User {} ({}) status set to {} by {}", user.getUserId(), user.getUsername(), newStatus, actingUsername);
        return toDTO(user);
    }

    @Transactional
    public UserCreatedResponseDTO createUser(UserCreateDTO dto) {
        String email = dto.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("A user with email " + email + " already exists");
        }
        Role role = roleRepository.findByRoleName(dto.getRoleName().trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new BadRequestException("Unknown role: " + dto.getRoleName()));
        Department department = departmentRepository.findByDepartmentName(dto.getDepartmentName().trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new BadRequestException("Unknown department: " + dto.getDepartmentName()));

        String temporaryPassword = randomPassword(12);
        User user = userRepository.save(User.builder()
                .username(uniqueUsername(email))
                .email(email)
                .name(dto.getName().trim())
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .role(role)
                .department(department)
                .status("ACTIVE")
                .build());
        log.info("User {} ({}) created with role {}", user.getUserId(), user.getUsername(), role.getRoleName());
        return new UserCreatedResponseDTO(toDTO(user), temporaryPassword);
    }

    private String uniqueUsername(String email) {
        String base = email.substring(0, email.indexOf('@')).replaceAll("[^a-z0-9._-]", "");
        if (base.isEmpty()) base = "user";
        base = base.length() > 40 ? base.substring(0, 40) : base;
        String candidate = base;
        for (int i = 1; userRepository.findByUsername(candidate).isPresent(); i++) {
            candidate = base + i;
        }
        return candidate;
    }

    private static String randomPassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(PASSWORD_ALPHABET.charAt(RANDOM.nextInt(PASSWORD_ALPHABET.length())));
        }
        return sb.toString();
    }

    private UserResponseDTO toDTO(User u) {
        return UserResponseDTO.builder()
                .userId(u.getUserId())
                .username(u.getUsername())
                .email(u.getEmail())
                .name(u.getName())
                .role(u.getRole() != null ? u.getRole().getRoleName() : "STAFF")
                .department(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "GENERAL")
                .status(u.getStatus() != null ? u.getStatus() : "ACTIVE")
                .build();
    }
}
