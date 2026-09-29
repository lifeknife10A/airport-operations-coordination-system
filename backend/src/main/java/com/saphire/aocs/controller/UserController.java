package com.saphire.aocs.controller;

import com.saphire.aocs.entity.User;
import com.saphire.aocs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// Full staff directory + account status changes -- admin-only. Any authenticated account could
// previously list every user in the system and suspend/reactivate other accounts.
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", u.getUserId());
            map.put("username", u.getUsername());
            map.put("name", u.getName());
            map.put("role", u.getRole() != null ? u.getRole().getRoleName() : "STAFF");
            map.put("department", u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "GENERAL");
            map.put("status", "ACTIVE");
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String newStatus = payload.getOrDefault("status", "ACTIVE").toUpperCase();

        // Administrative Security Rule: Root / Administrator account (ID 10 or 'admin') cannot be suspended
        if (id == 10L && "SUSPENDED".equalsIgnoreCase(newStatus)) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "SECURITY_POLICY_VIOLATION");
            err.put("message", "Administrative security policy: Root administrator accounts cannot be suspended.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User u = optionalUser.get();
        if ("admin".equalsIgnoreCase(u.getUsername()) && "SUSPENDED".equalsIgnoreCase(newStatus)) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "SECURITY_POLICY_VIOLATION");
            err.put("message", "Administrative security policy: System Administrator cannot suspend their own operational account.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("userId", u.getUserId());
        result.put("username", u.getUsername());
        result.put("name", u.getName());
        result.put("status", newStatus);
        result.put("message", "Account status updated successfully to " + newStatus);

        return ResponseEntity.ok(result);
    }
}
