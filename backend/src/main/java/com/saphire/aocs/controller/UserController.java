package com.saphire.aocs.controller;

import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Full staff directory + account status changes -- admin-only. Any authenticated account could
// previously list every user in the system and hit the (cosmetic -- see UserService) suspend
// endpoint.
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
            @Valid @RequestBody UserStatusUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateUserStatus(id, dto));
    }
}
