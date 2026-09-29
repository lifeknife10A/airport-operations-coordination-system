package com.saphire.aocs.controller;

import com.saphire.aocs.dto.InquiryCreateDTO;
import com.saphire.aocs.dto.InquiryResponseDTO;
import com.saphire.aocs.dto.InquiryStatusUpdateDTO;
import com.saphire.aocs.service.InquiryService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<InquiryResponseDTO> submitInquiry(@RequestBody InquiryCreateDTO dto) {
        InquiryResponseDTO created = inquiryService.createInquiry(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<InquiryResponseDTO> getByTicketNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(inquiryService.getByTicketNumber(ticketNumber));
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
            @RequestBody InquiryStatusUpdateDTO dto) {
        return ResponseEntity.ok(inquiryService.updateInquiryStatus(id, dto));
    }
}
