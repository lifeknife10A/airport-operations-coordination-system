package com.saphire.aocs.controller;

import com.saphire.aocs.dto.InquiryCreateDTO;
import com.saphire.aocs.dto.InquiryResponseDTO;
import com.saphire.aocs.dto.InquiryStatusUpdateDTO;
import com.saphire.aocs.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/inquiries", "/api/v1/inquiries"})
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryResponseDTO> submitInquiry(@Valid @RequestBody InquiryCreateDTO dto) {
        InquiryResponseDTO created = inquiryService.createInquiry(dto, isStaff());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Public route (see SecurityConfig). Ticket numbers are short and guessable, so an anonymous
    // caller only gets the ticket's status; the full record with the submitter's contact details
    // and message is returned only to a logged-in staff member.
    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<?> getByTicketNumber(@PathVariable String ticketNumber) {
        if (isStaff()) {
            return ResponseEntity.ok(inquiryService.getByTicketNumber(ticketNumber));
        }
        return ResponseEntity.ok(inquiryService.getPublicStatusByTicketNumber(ticketNumber));
    }

    private static boolean isStaff() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.getById(id));
    }

    @GetMapping
    public ResponseEntity<Page<InquiryResponseDTO>> searchInquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(inquiryService.searchInquiries(status, category, department, search, pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InquiryResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody InquiryStatusUpdateDTO dto) {
        return ResponseEntity.ok(inquiryService.updateInquiryStatus(id, dto));
    }
}
