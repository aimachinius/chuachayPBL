package com.example.demo.flightsTicketManager;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/*
 * 
 *   Id_Em string [primary key]
 *   Full_Name string 
 *   Id_Area string 
 *   Day_Of_Birth date 
 */
@Entity
@Table(name = "Air_Traffic_Controller_Employee")
public class Air_Traffic_Controller_Employee {

    @Id
    private String Id_Em;
    private String Full_Name;

    @ManyToOne
    @JoinColumn(name = "Id_Area")
    private Area Id_Area;

    private Date Day_Of_Birth;

    public Air_Traffic_Controller_Employee() {
    }

    public Air_Traffic_Controller_Employee(String idEm, String fullName, Area idArea, Date dayOfBirth) {
        this.Id_Em = idEm;
        this.Full_Name = fullName;
        this.Id_Area = idArea;
        this.Day_Of_Birth = dayOfBirth;
    }

    public String getKey() {
        return Id_Em;
    }

    public List<String> valueString() {
        List<String> value = new ArrayList<>();
        value.add(Full_Name);
        value.add(Id_Area != null ? Id_Area.getId_Area() : "null");
        value.add(Day_Of_Birth != null ? Day_Of_Birth.toString() : "null");
        return value;
    }

    // Getter và Setter
    public String getIdEm() {
        return Id_Em;
    }

    public void setIdEm(String idEm) {
        this.Id_Em = idEm;
    }

    public String getFullName() {
        return Full_Name;
    }

    public void setFullName(String fullName) {
        this.Full_Name = fullName;
    }

    public Area getIdArea() {
        return Id_Area;
    }

    public void setIdArea(Area idArea) {
        this.Id_Area = idArea;
    }

    public Date getDayOfBirth() {
        return Day_Of_Birth;
    }

    public void setDayOfBirth(Date dayOfBirth) {
        this.Day_Of_Birth = dayOfBirth;
    }

    @Override
    public String toString() {
        return "Air_Traffic_Controller_Employee{" +
                "Id_Em='" + Id_Em + '\'' +
                ", Full_Name='" + Full_Name + '\'' +
                ", Id_Area=" + (Id_Area != null ? Id_Area.getId_Area() : "null") +
                ", Day_Of_Birth=" + Day_Of_Birth +
                '}';
    }
}
