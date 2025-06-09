package com.example.demo.flightsTicketManager;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Area")
public class Area {
    @Id
    private String Id_Area;
    private int Plane_Count;
    private int Crew_Employee;
    private int ATC_Employee;
    @OneToMany(mappedBy = "Id_Area", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<Plane> planes = new ArrayList<>();
    @OneToMany(mappedBy = "Id_Area", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<Crew> crews = new ArrayList<>();
    @OneToMany(mappedBy = "Id_Area", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<Air_Traffic_Controller_Employee> atcs = new ArrayList<>();

    public List<Plane> getPlanes() {
        return planes;
    }

    public void setPlane(List<Plane> planes) {
        this.planes = planes;
    }

    public List<Crew> getCrew() {
        return crews;
    }

    public void setCrew(List<Crew> crews) {
        this.crews = crews;
    }

    public List<Air_Traffic_Controller_Employee> getATC() {
        return atcs;
    }

    public void setATC(List<Air_Traffic_Controller_Employee> atcs) {
        this.atcs = atcs;
    }

    public Area() {
    }

    public Area(String Id_Area, int Plane_Count, int Crew_Employee, int ATC_Employee) {
        this.Id_Area = Id_Area;
        this.Plane_Count = Plane_Count;
        this.Crew_Employee = Crew_Employee;
        this.ATC_Employee = ATC_Employee;
    }

    public String getKey() {
        return Id_Area;
    }

    public List<String> valueString() {
        List<String> value = new ArrayList<>();
        value.add(Integer.toString(Plane_Count));
        value.add(Integer.toString(Crew_Employee));
        value.add(Integer.toString(ATC_Employee));
        return value;
    }

    public String getId_Area() {
        return Id_Area;
    }

    public void setId_Area(String Id_Area) {
        this.Id_Area = Id_Area;
    }

    public int getPlane_Count() {
        return Plane_Count;
    }

    public void setPlane_Count(int Plane_Count) {
        this.Plane_Count = Plane_Count;
    }

    public int getCrew_Employee() {
        return Crew_Employee;
    }

    public void setCrew_Employee(int Crew_Employee) {
        this.Crew_Employee = Crew_Employee;
    }

    public int getATC_Employee() {
        return ATC_Employee;
    }

    public void setATC_Employee(int ATC_Employee) {
        this.ATC_Employee = ATC_Employee;
    }

    @Override
    public String toString() {
        return "Area{" +
                "Id_Area='" + Id_Area + '\'' +
                ", Plane_Count=" + Plane_Count +
                ", Crew_Employee=" + Crew_Employee +
                ", ATC_Employee=" + ATC_Employee +
                '}';
    }
}
