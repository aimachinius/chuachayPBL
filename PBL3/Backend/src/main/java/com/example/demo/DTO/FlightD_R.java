package com.example.demo.DTO;

import com.example.demo.Model.Flight;

public class FlightD_R {
    public Flight flight;
    public String styleSeat;

    public FlightD_R(Flight flight, String styleSeat) {
        this.flight = flight;
        this.styleSeat = styleSeat;
    }

};
