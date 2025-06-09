package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.FlightService;
import com.example.demo.Service.Flights_SeatService;
import com.example.demo.Service.SeatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.Enum.SeatStatus;
import com.example.demo.Model.Flight;
import com.example.demo.Model.Flights_Seat;
import com.example.demo.Model.Seat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/flights_seat")
public class Flights_SeatController {
    @Autowired
    private Flights_SeatService flights_SeatService = new Flights_SeatService();
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private FlightService flightService = new FlightService();

    @GetMapping("")
    public List<Map<String, Object>> listSeat(@RequestParam int idFlight) {
        List<Map<String, Object>> data = new ArrayList<>();
        Flight flight = flightService.getFlightById(idFlight);
        List<Flights_Seat> flights_Seats = flights_SeatService.getAllFlight_Seat(flight);

        for (Flights_Seat flights_Seat : flights_Seats) {
            Map<String, Object> element = new HashMap<>();
            element.put("seat", flights_Seat.getSeat());
            element.put("status", flights_Seat.getSeatStatus());
            data.add(element);
        }
        return data;
    }

    @PatchMapping("/update_status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, Object> requestBody) {
        Flight flight = objectMapper.convertValue(requestBody.get("Flight"), Flight.class);
        Seat seat = objectMapper.convertValue(requestBody.get("Seat"), Seat.class);
        int index = (int) requestBody.get("index");
        boolean result = flights_SeatService.updateStatus(flight, seat, index);
        if (result) {
            return ResponseEntity.ok("Update status successfully");
        } else {
            return ResponseEntity.badRequest().body("Update status failed");
        }
    }
}
