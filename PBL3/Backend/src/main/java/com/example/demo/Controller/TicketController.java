package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.BaggageDTO;
import com.example.demo.DTO.TicketDTO;
import com.example.demo.Enum.SeatStatus;
import com.example.demo.Model.Customer;
import com.example.demo.Model.Flights_Seat;
import com.example.demo.Model.Seat;
import com.example.demo.Model.Ticket;
import com.example.demo.Model.Trip;
import com.example.demo.Repository.SeatRepo;
import com.example.demo.Service.TicketService;
import com.example.demo.Model.Baggage;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/ticket")
public class TicketController {
    @Autowired
    private TicketService ticketService;
    @Autowired
    private SeatRepo seatRepo;

    @PostMapping("/submit")
    public ResponseEntity<?> addTicket(@RequestBody TicketDTO ticket) {
        int count = ticket.listCustomer.size();
        for (int i = 0; i < count; i++) {
            Customer customer = ticket.listCustomer.get(i);
            Trip trip = new Trip(ticket.departureFlight.flight, ticket.returnFlight.flight);
            Seat departureSeat = seatRepo.findBySeatNumberAndPlane(String.valueOf(ticket.listDepartureSeat.get(i)),
                    ticket.departureFlight.flight.getPlane());
            Seat returnSeat = seatRepo.findBySeatNumberAndPlane(String.valueOf(ticket.listReturnSeat.get(i)),
                    ticket.returnFlight.flight.getPlane());
            Flights_Seat departurFlight_Seat = new Flights_Seat(ticket.departureFlight.flight, departureSeat,
                    SeatStatus.BOOKED);
            Flights_Seat returnFlight_Seat = new Flights_Seat(ticket.returnFlight.flight, returnSeat,
                    SeatStatus.BOOKED);
            Long price = ticket.listPrice.get(i);
            BaggageDTO baggageDTODeparture = ticket.listBaggageDeparture.get(i);
            BaggageDTO baggageDTOReturn = ticket.listBaggageReturn.get(i);

            Baggage departureBaggage = new Baggage(baggageDTODeparture.weight, baggageDTODeparture.price,
                    null);
            Baggage returnBaggage = new Baggage(baggageDTOReturn.weight, baggageDTOReturn.price, null);

            Ticket ticket2 = new Ticket(customer, trip, departurFlight_Seat, returnFlight_Seat, price, departureBaggage,
                    returnBaggage);
            if (!ticketService.addTicket(ticket2))
                return ResponseEntity.ofNullable(null);
        }

        return (ResponseEntity<?>) ResponseEntity.ok();
    }
}
