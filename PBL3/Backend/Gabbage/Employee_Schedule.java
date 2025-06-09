package com.example.demo.flightsTicketManager;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Employee_Schedule")
public class Employee_Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id_E_S;

    @ManyToOne
    private Flight Id_Flight;

    @ManyToOne
    private Crew Id_Crew_Em;

    private Time Shift_Time;
    private Date Duty_date;

    public Employee_Schedule() {
    }

    public Employee_Schedule(Flight id_Flight, Crew id_Crew_Em, Time shift_Time, Date duty_date) {
        this.Id_Flight = id_Flight;
        this.Id_Crew_Em = id_Crew_Em;
        this.Shift_Time = shift_Time;
        this.Duty_date = duty_date;
    }

    public Flight getId_Flight() {
        return Id_Flight;
    }

    public void setId_Flight(Flight id_Flight) {
        Id_Flight = id_Flight;
    }

    public Crew getId_Crew_Em() {
        return Id_Crew_Em;
    }

    public void setId_Crew_Em(Crew id_Crew_Em) {
        Id_Crew_Em = id_Crew_Em;
    }

    public Time getShift_Time() {
        return Shift_Time;
    }

    public void setShift_Time(Time shift_Time) {
        Shift_Time = shift_Time;
    }

    public Date getDuty_date() {
        return Duty_date;
    }

    public void setDuty_date(Date duty_date) {
        Duty_date = duty_date;
    }

    @Override
    public String toString() {
        return "Employee_Schedule{" +
                "Id_E_S=" + Id_E_S +
                ", Id_Flight=" + (Id_Flight != null ? Id_Flight.getId_Flight() : "null") +
                ", Id_Crew_Em=" + (Id_Crew_Em != null ? Id_Crew_Em.getId_Crew_Em() : "null") +
                ", Shift_Time=" + Shift_Time +
                ", Duty_date=" + Duty_date +
                '}';
    }

    public String getKey() {
        return Id_Flight != null ? Id_Flight.getId_Flight() : null;
    }

    public List<String> valueString() {
        List<String> value = new ArrayList<>();
        value.add(Id_Crew_Em != null ? Id_Crew_Em.getId_Crew_Em() : "null");
        value.add(Shift_Time.toString());
        value.add(Duty_date.toString());
        return value;
    }
}
