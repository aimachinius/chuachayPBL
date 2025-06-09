package com.example.demo.flightsTicketManager;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Crew")
public class Crew {
    @Id
    private String Id_Crew_Em;
    private String Full_Name;
    @ManyToOne
    @JoinColumn(name = "Id_Area")
    private Area Id_Area;
    private String Position;
    private Date Day_Of_Birth;

    public Crew() {
    }

    public Crew(String Id_Crew_Em, String Full_Name, Area Id_Area, String Position, Date Day_Of_Birth) {
        this.Id_Crew_Em = Id_Crew_Em;
        this.Full_Name = Full_Name;
        this.Id_Area = Id_Area;
        this.Position = Position;
        this.Day_Of_Birth = Day_Of_Birth;
    }

    public String getKey() {
        return Id_Crew_Em;
    }

    public List<String> valueString() {
        List<String> value = new ArrayList<>();
        value.add(Full_Name);
        value.add(Id_Area.getId_Area());
        value.add(Position);
        value.add(Day_Of_Birth.toString());
        return value;
    }

    public String getId_Crew_Em() {
        return Id_Crew_Em;
    }

    public void setId_Crew_Em(String Id_Crew_Em) {
        this.Id_Crew_Em = Id_Crew_Em;
    }

    public String getFull_Name() {
        return Full_Name;
    }

    public void setFull_Name(String Full_Name) {
        this.Full_Name = Full_Name;
    }

    public Area getId_Area() {
        return Id_Area;
    }

    public void setId_Area(Area Id_Area) {
        this.Id_Area = Id_Area;
    }

    public String getPosition() {
        return Position;
    }

    public void setPosition(String Position) {
        this.Position = Position;
    }

    public Date getDay_Of_Birth() {
        return Day_Of_Birth;
    }

    public void setDay_Of_Birth(Date Day_Of_Birth) {
        this.Day_Of_Birth = Day_Of_Birth;
    }

    @Override
    public String toString() {
        return "Crew{" +
                "Id_Crew_Em='" + Id_Crew_Em + '\'' +
                ", Full_Name='" + Full_Name + '\'' +
                ", Id_Area='" + Id_Area + '\'' +
                ", Position='" + Position + '\'' +
                ", Day_Of_Birth=" + Day_Of_Birth +
                '}';
    }
}
