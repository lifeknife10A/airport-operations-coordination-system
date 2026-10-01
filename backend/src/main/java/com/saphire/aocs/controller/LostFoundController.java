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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lost-found")
@CrossOrigin(origins = "*")
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
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{referenceCode}")
    public ResponseEntity<LostFoundResponseDTO> getByReferenceCode(@PathVariable String referenceCode) {
        LostFoundResponseDTO result = lostFoundService.getByReferenceCode(referenceCode);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<LostFoundResponseDTO> reportItem(@Valid @RequestBody LostFoundReportDTO dto) {
        LostFoundResponseDTO result = lostFoundService.reportItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LostFoundResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody LostFoundStatusDTO dto
    ) {
        LostFoundResponseDTO result = lostFoundService.updateStatus(id, dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<LostFoundResponseDTO> claimItem(
            @PathVariable Long id,
            @Valid @RequestBody LostFoundClaimDTO dto
    ) {
        LostFoundResponseDTO result = lostFoundService.claimItem(id, dto);
        return ResponseEntity.ok(result);
    }
}
