package com.saphire.aocs.controller;

import com.saphire.aocs.dto.*;
import com.saphire.aocs.service.CheckinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/checkin", "/api/v1/checkin"})
@RequiredArgsConstructor
public class CheckinController {

    private final CheckinService checkinService;

    @GetMapping("/lookup")
    public ResponseEntity<CheckinLookupDTO> lookupPassenger(@RequestParam String query) {
        return ResponseEntity.ok(checkinService.lookupPassenger(query));
    }

    @GetMapping("/flights/{flightId}/seatmap")
    public ResponseEntity<SeatMapResponseDTO> getSeatMap(@PathVariable Long flightId) {
        return ResponseEntity.ok(checkinService.getSeatMap(flightId));
    }

    @PostMapping("/issue-boarding-pass")
    public ResponseEntity<BoardingPassResponseDTO> issueBoardingPass(@Valid @RequestBody IssueBoardingPassDTO dto) {
        BoardingPassResponseDTO issued = checkinService.issueBoardingPass(dto);
        return new ResponseEntity<>(issued, HttpStatus.CREATED);
    }

    @PostMapping("/tag-baggage")
    public ResponseEntity<BagTagResponseDTO> tagBaggage(@Valid @RequestBody TagBaggageRequestDTO dto) {
        BagTagResponseDTO tagged = checkinService.tagBaggage(dto);
        return new ResponseEntity<>(tagged, HttpStatus.CREATED);
    }

    @GetMapping("/counters")
    public ResponseEntity<List<CheckinCounterDTO>> getAllCounters() {
        return ResponseEntity.ok(checkinService.getAllCounters());
    }
}
