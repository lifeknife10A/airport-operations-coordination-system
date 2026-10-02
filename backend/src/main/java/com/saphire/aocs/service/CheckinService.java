package com.saphire.aocs.service;

import com.saphire.aocs.dto.*;
import com.saphire.aocs.entity.*;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckinService {

    private final PassengerRepository passengerRepository;
    private final BoardingPassRepository boardingPassRepository;
    private final BagTagRepository bagTagRepository;
    private final BaggageScanEventRepository baggageScanEventRepository;
    private final CheckinCounterRepository checkinCounterRepository;
    private final FlightRepository flightRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public CheckinLookupDTO lookupPassenger(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new ResourceNotFoundException("Search query cannot be empty");
        }
        String cleanQuery = query.trim();

        List<Passenger> results = passengerRepository.searchPassenger(cleanQuery);
        Passenger passenger;
        if (results.size() == 1) {
            passenger = results.get(0);
        } else if (results.size() > 1) {
            // A partial name matches many people. Quietly picking the first one could check in the
            // wrong passenger, so prefer an exact PNR/passport hit and otherwise ask for one.
            List<Passenger> exact = results.stream()
                    .filter(p -> cleanQuery.equalsIgnoreCase(p.getPnrCode())
                            || (p.getTraveler() != null && cleanQuery.equalsIgnoreCase(p.getTraveler().getPassportNumber())))
                    .toList();
            if (exact.size() != 1) {
                throw new ConflictException(results.size() + " passengers match '" + cleanQuery
                        + "'. Search by PNR code or passport number to select one.");
            }
            passenger = exact.get(0);
        } else {
            try {
                Long id = Long.parseLong(cleanQuery);
                passenger = passengerRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("No active booking found for query: " + cleanQuery));
            } catch (NumberFormatException e) {
                throw new ResourceNotFoundException("No active booking found for query: " + cleanQuery);
            }
        }

        Optional<BoardingPass> bpOpt = boardingPassRepository.findByPassengerPassengerId(passenger.getPassengerId());
        List<BagTag> bagTags = bagTagRepository.findByPassengerPassengerId(passenger.getPassengerId());

        Flight flight = passenger.getFlight();
        Traveler traveler = passenger.getTraveler();

        List<BagTagResponseDTO> bagDTOs = bagTags.stream().map(b -> BagTagResponseDTO.builder()
                .bagTagId(b.getBagTagId())
                .tagNumber(b.getTagNumber())
                .weightKg(b.getWeightKg())
                .status(b.getStatus())
                .passengerId(passenger.getPassengerId())
                .flightId(flight.getFlightId())
                .build()).collect(Collectors.toList());

        CheckinLookupDTO.CheckinLookupDTOBuilder builder = CheckinLookupDTO.builder()
                .passengerId(passenger.getPassengerId())
                .pnrCode(passenger.getPnrCode())
                .travelerId(traveler.getTravelerId())
                .travelerName(traveler.getFirstName() + " " + traveler.getLastName())
                .passportNumber(traveler.getPassportNumber())
                .nationality(traveler.getNationality())
                .isTransitPassenger(passenger.getIsTransitPassenger())
                .flightId(flight.getFlightId())
                .flightNumber(flight.getFlightNumber())
                .airlineName(flight.getAirline() != null ? flight.getAirline().getAirlineName() : "Saphire Airlines")
                .originIata(flight.getOriginAirport() != null ? flight.getOriginAirport().getIataCode() : "BOM")
                .destinationIata(flight.getDestinationAirport() != null ? flight.getDestinationAirport().getIataCode() : "DEL")
                .departureGate(flight.getGate() != null ? flight.getGate().getGateNumber() : "TBD")
                .stand(flight.getStand() != null ? flight.getStand().getStandNumber() : "TBD")
                .scheduledDeparture(flight.getScheduledDepartureTime())
                .flightStatus(flight.getFlightStatus() != null ? flight.getFlightStatus() : "SCHEDULED")
                .baggageTags(bagDTOs);

        if (bpOpt.isPresent()) {
            BoardingPass bp = bpOpt.get();
            builder.isCheckedIn(true)
                    .seatNumber(bp.getSeatNumber())
                    .cabinClass(bp.getCabinClass())
                    .boardingGroup(bp.getBoardingGroup())
                    .sequenceNumber(bp.getSequenceNumber())
                    .ticketNumber(bp.getTicketNumber())
                    .barcodeData(bp.getBarcodeData());
        } else {
            builder.isCheckedIn(false);
        }

        return builder.build();
    }

    @Transactional(readOnly = true)
    public SeatMapResponseDTO getSeatMap(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));

        List<String> occupiedSeats = boardingPassRepository.findOccupiedSeatsByFlightId(flightId);
        int totalCapacity = 180;
        if (flight.getAircraft() != null && flight.getAircraft().getAircraftType() != null) {
            totalCapacity = flight.getAircraft().getAircraftType().getMaxPassengerCapacity();
        }

        return SeatMapResponseDTO.builder()
                .flightId(flightId)
                .flightNumber(flight.getFlightNumber())
                .aircraftModel(flight.getAircraft() != null && flight.getAircraft().getAircraftType() != null 
                        ? flight.getAircraft().getAircraftType().getModelName() : "Airbus A320neo")
                .totalCapacity(totalCapacity)
                .occupiedSeatsCount(occupiedSeats.size())
                .availableSeatsCount(Math.max(0, totalCapacity - occupiedSeats.size()))
                .occupiedSeats(occupiedSeats)
                .cabinTiers(Arrays.asList("FIRST", "BUSINESS", "PREMIUM_ECONOMY", "ECONOMY"))
                .build();
    }

    @Transactional
    public BoardingPassResponseDTO issueBoardingPass(IssueBoardingPassDTO dto) {
        Passenger passenger = passengerRepository.findById(dto.getPassengerId())
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with ID: " + dto.getPassengerId()));

        Optional<BoardingPass> existing = boardingPassRepository.findByPassengerPassengerId(dto.getPassengerId());
        if (existing.isPresent()) {
            throw new ConflictException("Boarding pass already issued for passenger " + passenger.getPnrCode() + " at seat " + existing.get().getSeatNumber());
        }

        Flight flight = passenger.getFlight();
        Traveler traveler = passenger.getTraveler();

        String seat = dto.getSeatNumber().toUpperCase();
        if (boardingPassRepository.existsByFlightFlightIdAndSeatNumber(flight.getFlightId(), seat)) {
            throw new ConflictException("Seat " + seat + " on flight " + flight.getFlightNumber() + " is already taken");
        }

        Integer nextSeq = boardingPassRepository.findMaxSequenceNumberByFlightId(flight.getFlightId()) + 1;
        String ticketNumber = uniqueTicketNumber();
        String barcodeData = String.format("M1%s/%s %s %s %s", 
                passenger.getPnrCode(), 
                traveler.getLastName().toUpperCase(), 
                flight.getFlightNumber(), 
                dto.getSeatNumber(), 
                ticketNumber);

        String cabinClass = dto.getCabinClass() != null ? dto.getCabinClass().toUpperCase() : "ECONOMY";
        String boardingGroup = "ZONE 3";
        if ("FIRST".equalsIgnoreCase(cabinClass)) boardingGroup = "ZONE 1";
        else if ("BUSINESS".equalsIgnoreCase(cabinClass)) boardingGroup = "ZONE 1";
        else if ("PREMIUM_ECONOMY".equalsIgnoreCase(cabinClass)) boardingGroup = "ZONE 2";

        BoardingPass bp = BoardingPass.builder()
                .passenger(passenger)
                .flight(flight)
                .seatNumber(dto.getSeatNumber().toUpperCase())
                .cabinClass(cabinClass)
                .boardingGroup(boardingGroup)
                .sequenceNumber(nextSeq)
                .frequentFlyerNumber(dto.getFrequentFlyerNumber())
                .ticketNumber(ticketNumber)
                .barcodeData(barcodeData)
                .build();

        BoardingPass saved = boardingPassRepository.save(bp);

        String gateStr = flight.getGate() != null ? flight.getGate().getGateNumber() : "TBA";
        String originStr = flight.getOriginAirport() != null ? flight.getOriginAirport().getIataCode() : "BOM";
        String destStr = flight.getDestinationAirport() != null ? flight.getDestinationAirport().getIataCode() : "DEL";

        String boardingTimeStr = "07:20";
        if (flight.getScheduledDepartureTime() != null) {
            boardingTimeStr = flight.getScheduledDepartureTime().minusMinutes(40).toLocalTime().toString();
        }

        return BoardingPassResponseDTO.builder()
                .boardingPassId(saved.getBoardingPassId())
                .barcodeData(saved.getBarcodeData())
                .ticketNumber(saved.getTicketNumber())
                .seatNumber(saved.getSeatNumber())
                .cabinClass(saved.getCabinClass())
                .boardingGroup(saved.getBoardingGroup())
                .sequenceNumber(saved.getSequenceNumber())
                .frequentFlyerNumber(saved.getFrequentFlyerNumber())
                .passengerId(passenger.getPassengerId())
                .passengerName(traveler.getFirstName() + " " + traveler.getLastName())
                .pnrCode(passenger.getPnrCode())
                .flightId(flight.getFlightId())
                .flightNumber(flight.getFlightNumber())
                .originIata(originStr)
                .destinationIata(destStr)
                .departureGate(gateStr)
                .boardingTime(boardingTimeStr)
                .scheduledDeparture(flight.getScheduledDepartureTime() != null ? flight.getScheduledDepartureTime().toString() : "")
                .build();
    }

    @Transactional
    public BagTagResponseDTO tagBaggage(TagBaggageRequestDTO dto) {
        Passenger passenger = passengerRepository.findById(dto.getPassengerId())
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with ID: " + dto.getPassengerId()));

        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + dto.getFlightId()));

        String tagNumber = uniqueTagNumber();

        BagTag bagTag = BagTag.builder()
                .tagNumber(tagNumber)
                .passenger(passenger)
                .flight(flight)
                .weightKg(dto.getWeightKg())
                .status("CHECKED_IN")
                .build();

        BagTag saved = bagTagRepository.save(bagTag);

        BaggageScanEvent scanEvent = BaggageScanEvent.builder()
                .bagTag(saved)
                .scanLocation(dto.getScannerLocation() != null ? dto.getScannerLocation() : "CHECKIN_DESK_MAIN")
                .scanTimestamp(ZonedDateTime.now())
                .build();

        baggageScanEventRepository.save(scanEvent);

        return BagTagResponseDTO.builder()
                .bagTagId(saved.getBagTagId())
                .tagNumber(saved.getTagNumber())
                .weightKg(saved.getWeightKg())
                .status(saved.getStatus())
                .passengerId(passenger.getPassengerId())
                .flightId(flight.getFlightId())
                .build();
    }

    /** Every passenger booked on the flight with their boarding pass (if issued) and checked bags. */
    @Transactional(readOnly = true)
    public List<com.saphire.aocs.dto.CheckinManifestEntry> getFlightManifest(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            throw new ResourceNotFoundException("Flight not found with ID: " + flightId);
        }
        return jdbcTemplate.query(
                "SELECT p.passenger_id, p.pnr_code, t.first_name, t.last_name, t.nationality, "
                + "b.boarding_pass_id, b.seat_number, b.cabin_class, b.boarding_group, b.ticket_number, b.barcode_data, "
                + "(SELECT COUNT(*) FROM bag_tags g WHERE g.passenger_id = p.passenger_id AND g.flight_id = p.flight_id) AS bags, "
                + "(SELECT COALESCE(SUM(g.weight_kg), 0) FROM bag_tags g WHERE g.passenger_id = p.passenger_id AND g.flight_id = p.flight_id) AS bag_kg "
                + "FROM passengers p JOIN travelers t ON t.traveler_id = p.traveler_id "
                + "LEFT JOIN boarding_passes b ON b.passenger_id = p.passenger_id AND b.flight_id = p.flight_id "
                + "WHERE p.flight_id = ? ORDER BY b.sequence_number NULLS LAST, p.passenger_id",
                (rs, i) -> new com.saphire.aocs.dto.CheckinManifestEntry(rs.getLong("passenger_id"), rs.getString("pnr_code"),
                        rs.getString("first_name") + " " + rs.getString("last_name"), rs.getString("nationality"),
                        (Long) rs.getObject("boarding_pass_id"), rs.getString("seat_number"), rs.getString("cabin_class"),
                        rs.getString("boarding_group"), rs.getString("ticket_number"), rs.getString("barcode_data"),
                        rs.getLong("bags"), rs.getDouble("bag_kg")),
                flightId);
    }

    @Transactional(readOnly = true)
    public List<CheckinCounterDTO> getAllCounters() {
        return checkinCounterRepository.findAll().stream().map(c -> CheckinCounterDTO.builder()
                .counterId(c.getCounterId())
                .counterNumber(c.getCounterNumber())
                .terminal(c.getTerminal())
                .concourse(c.getConcourse())
                .allocatedAirlineId(c.getAllocatedAirline() != null ? c.getAllocatedAirline().getAirlineId() : null)
                .allocatedAirlineName(c.getAllocatedAirline() != null ? c.getAllocatedAirline().getAirlineName() : "Unassigned")
                .allocatedAirlineIata(c.getAllocatedAirline() != null ? c.getAllocatedAirline().getIataCode() : "--")
                .status(c.getAllocatedAirline() != null ? "ALLOCATED" : "UNASSIGNED")
                .build()).collect(Collectors.toList());
    }

    // Random six-digit numbers collide once a few thousand exist (the unique constraints would then
    // turn a normal check-in into a 500), so draw again until the number is free.
    private String uniqueTicketNumber() {
        String ticket;
        do {
            ticket = "ETKT-2026-" + String.format("%06d", (int) (Math.random() * 900000) + 100000);
        } while (boardingPassRepository.findByTicketNumber(ticket).isPresent());
        return ticket;
    }

    private String uniqueTagNumber() {
        String tag;
        do {
            tag = "0098" + String.format("%06d", (int) (Math.random() * 900000) + 100000);
        } while (bagTagRepository.findByTagNumber(tag).isPresent());
        return tag;
    }
}
