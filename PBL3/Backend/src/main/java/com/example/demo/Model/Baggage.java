package com.example.demo.Model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import com.example.demo.Enum.TypeBaggage;

@Entity
@Table(name = "Baggage")
public class Baggage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Baggage")
    private int idBaggage;

    @Column(name = "Baggage_Type")
    private String baggageType;

    @Column(name = "Baggage_Weight")
    private float baggageWeight;

    @ManyToOne
    @JoinColumn(name = "idTicket", referencedColumnName = "idTicket", nullable = false)
    private Ticket ticket;

    public Baggage() {
    }

    public Baggage(int idBaggage, TypeBaggage baggageType, float baggageWeight) {
        this.idBaggage = idBaggage;
        this.baggageType = baggageType.toString();
        this.baggageWeight = baggageWeight;
    }

    public Baggage(float baggageWeight, float price, String text) {
        this.baggageType = TypeBaggage.CHECKED_BA.toString();
        this.baggageWeight = baggageWeight;
    }

    public Baggage(TypeBaggage baggageType, float baggageWeight, Ticket tk) {
        this.baggageType = baggageType.toString();
        this.baggageWeight = baggageWeight;
        this.ticket = tk;
    }

    public int getKey() {
        return idBaggage;
    }

    public List<String> valueString() {
        List<String> value = new ArrayList<>();
        value.add(baggageType.toString());
        value.add(String.valueOf(baggageWeight));
        return value;
    }

    public int getIdBaggage() {
        return idBaggage;
    }

    public void setIdBaggage(int idBaggage) {
        this.idBaggage = idBaggage;
    }

    public TypeBaggage getBaggageType() {
        return TypeBaggage.valueOf(baggageType);
    }

    public void setBaggageType(TypeBaggage baggageType) {
        this.baggageType = baggageType.toString();
    }

    public float getBaggageWeight() {
        return baggageWeight;
    }

    public void setBaggageWeight(float baggageWeight) {
        this.baggageWeight = baggageWeight;
    }

    @Override
    public String toString() {
        return "Baggage{" +
                "idBaggage=" + idBaggage +
                ", baggageType=" + baggageType +
                ", baggageWeight=" + baggageWeight +
                '}';
    }

    public void Copy(Baggage baggage) {
        this.baggageType = baggage.getBaggageType().toString();
        this.baggageWeight = baggage.getBaggageWeight();
    }
}
