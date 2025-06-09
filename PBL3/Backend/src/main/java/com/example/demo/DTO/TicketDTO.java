package com.example.demo.DTO;

import java.util.List;

import com.example.demo.Model.Baggage;
import com.example.demo.Model.Customer;

public class TicketDTO {
    public FlightD_R departureFlight;
    public FlightD_R returnFlight;
    public List<BaggageDTO> listBaggageDeparture;
    public List<BaggageDTO> listBaggageReturn;
    public List<Customer> listCustomer;
    public List<Long> listPrice;
    public List<Integer> listDepartureSeat;
    public List<Integer> listReturnSeat;

    //
    public TicketDTO(FlightD_R depaF, FlightD_R retuF,
            List<BaggageDTO> listBD, List<BaggageDTO> listBR,
            List<Customer> listC, List<Long> listPrice,
            List<Integer> listDS, List<Integer> listRS) {
        this.departureFlight = depaF;
        this.returnFlight = retuF;
        this.listBaggageDeparture = listBD;
        this.listBaggageReturn = listBR;
        this.listCustomer = listC;
        this.listPrice = listPrice;
        this.listDepartureSeat = listDS;
        this.listReturnSeat = listRS;
    }

}
