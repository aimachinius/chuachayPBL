package com.example.demo.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.Repository.Flights_SeatRepo;
import com.example.demo.Model.Flights_Seat;
import java.util.List;
import com.example.demo.Model.Flight;
import com.example.demo.Model.Seat;
import com.example.demo.Enum.SeatStatus;
// import com.example.demo.Model.Flight;
import com.example.demo.Model.Plane;
import com.example.demo.Service.FlightService;
import com.example.demo.Service.SeatService;

@Service
public class Flights_SeatService {
    @Autowired
    private Flights_SeatRepo flight_seatRepo;
    @Autowired
    private PlaneService planeService;

    // public Flights_SeatService(Flights_SeatRepo flight_seatRepo) {
    // this.flight_seatRepo = flight_seatRepo;
    // }
    public Flights_SeatService() {
    }

    public List<Flights_Seat> getAllFlight_Seat(Flight flight) {
        return flight_seatRepo.findByFlight(flight);
    }

    public void addFlight_Seat(Flight flight) {
        System.out.println("creating");
        Plane plane = flight.getPlane();
        List<Seat> listSeat = planeService.getListSeat(plane);
        System.out.println(listSeat.size());
        if (listSeat.size() == 0)
            return;
        int index = 0;
        for (Seat seat : listSeat) {
            System.out.println(++index);
            flight_seatRepo.save(new Flights_Seat(flight, seat, SeatStatus.NOT_BOOKED));
        }
    }

    public boolean updateStatus(Flight flight, Seat seat, int index) {

        Flights_Seat flight_seat = flight_seatRepo.findByFlightAndSeat(flight, seat);
        if (flight_seat != null) {
            if (index == 1) {
                flight_seat.setSeatStatus(SeatStatus.NOT_BOOKED);
            } else if (index == 0) {
                flight_seat.setSeatStatus(SeatStatus.BOOKED);
            }
            flight_seatRepo.save(flight_seat);
            return true;
        }
        return false;
    }
    //
    // public Flights_Seat getByIdFlightsAndIdSeat(int flightId, int seatId) {
    // return flight_seatRepo.findByIdFlightAndIdSeat(flightId, seatId);
    // }
    //
    // public List<Flights_Seat> getFlights_SeatByFlightId(int flightId) {
    // return flight_seatRepo.findByIdFlight(flightId);
    // }
    //
    // public void addFlight_Seat(Flight flight, Seat seat) {
    // Flights_Seat flight_seat = new Flights_Seat(flight, seat, SeatStatus.BOOKED);
    // if
    // (flight_seatRepo.findByIdFlightAndIdSeat(flight_seat.getSeat().getIdSeat(),
    // flight_seat.getFlight().getIdFlight()) == null) {
    // flight_seatRepo.save(flight_seat);
    // }
    // }
}
