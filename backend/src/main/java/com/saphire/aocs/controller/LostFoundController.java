package com.saphire.aocs.controller;

import com.saphire.aocs.dto.LostFoundClaimDTO;
import com.saphire.aocs.dto.LostFoundReportDTO;
import com.saphire.aocs.dto.LostFoundResponseDTO;
import com.saphire.aocs.dto.LostFoundStatusDTO;
import com.saphire.aocs.service.LostFoundService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @GetMapping
    public ResponseEntity<Page<LostFoundResponseDTO>> searchItems(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<LostFoundResponseDTO> results = lostFoundService.searchItems(query, category, status, page, size);
        // Public route: anonymous callers must not see who claimed an item or their contact details.
        return ResponseEntity.ok(staffUsername() == null ? results.map(LostFoundService::redactForPublic) : results);
    }

    @GetMapping("/{referenceCode}")
    public ResponseEntity<LostFoundResponseDTO> getByReferenceCode(@PathVariable String referenceCode) {
        LostFoundResponseDTO result = lostFoundService.getByReferenceCode(referenceCode);
        return ResponseEntity.ok(staffUsername() == null ? LostFoundService.redactForPublic(result) : result);
    }

    @PostMapping
    public ResponseEntity<LostFoundResponseDTO> reportItem(@Valid @RequestBody LostFoundReportDTO dto) {
        LostFoundResponseDTO result = lostFoundService.reportItem(dto, staffUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(staffUsername() == null ? LostFoundService.redactForPublic(result) : result);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'SECURITY_OFFICER', 'CHECKIN_AGENT', 'GATE_AGENT')")
    @PutMapping("/{id}/status")
    public ResponseEntity<LostFoundResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody LostFoundStatusDTO dto
    ) {
        LostFoundResponseDTO result = lostFoundService.updateStatus(id, dto);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR', 'AIRPORT_OPERATIONS_MANAGER', 'SECURITY_OFFICER', 'CHECKIN_AGENT', 'GATE_AGENT')")
    @PostMapping("/{id}/claim")
    public ResponseEntity<LostFoundResponseDTO> claimItem(
            @PathVariable Long id,
            @Valid @RequestBody LostFoundClaimDTO dto
    ) {
        LostFoundResponseDTO result = lostFoundService.claimItem(id, dto, staffUsername());
        return ResponseEntity.ok(result);
    }

    /** Username of the logged-in staff member, or null for an anonymous caller. */
    private static String staffUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken))
                ? auth.getName() : null;
    }
}
