package com.saphire.aocs.controller;

import com.saphire.aocs.dto.UserCreateDTO;
import com.saphire.aocs.dto.UserCreatedResponseDTO;
import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Full staff directory, account creation and suspension -- admin-only.
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserResponseDTO> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateDTO dto,
            Authentication auth) {
        return ResponseEntity.ok(userService.updateUserStatus(id, dto, auth.getName()));
    }

    @PostMapping
    public ResponseEntity<UserCreatedResponseDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(dto));
    }
}
