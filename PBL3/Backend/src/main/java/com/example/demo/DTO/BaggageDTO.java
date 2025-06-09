package com.example.demo.DTO;

// {weight: 20, price: 300000, displayText: "Hành lý 20kg (300,000 VNĐ)"}
public class BaggageDTO {
    public float weight;
    public long price;
    public String text;

    public BaggageDTO(float weight, long price, String text) {
        this.weight = weight;
        this.price = price;
    }
}
