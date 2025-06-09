package com.example.demo.Controller;

import com.example.demo.Model.Flight;
import com.example.demo.Model.Location;
import com.example.demo.Model.Plane;
import com.example.demo.Service.FlightService;
import com.example.demo.Service.PlaneService;
import com.example.demo.Enum.Status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private PlaneService planeService;
    @Autowired
    private FlightService flightService;

    // Get all planes
    @GetMapping("/planes")
    public List<Plane> getAllPlanes() {
        return planeService.getAllPlane();
    }

    // Get plane by id
    @GetMapping("/planes/{id}")
    public Plane getPlaneById(@PathVariable int id) {
        return planeService.getPlaneById(id);
    }

    // Get planes by name
    @GetMapping("/planes/name/{name}")
    public List<Plane> getPlaneByName(@PathVariable String name) {
        return planeService.getPlaneByName(name);
    }

    // Get planes by seat count
    @GetMapping("/planes/seats/{count}")
    public List<Plane> getPlaneBySeatCount(@PathVariable int count) {
        return planeService.getPlaneBySeatCount(count);
    }

    // Create a new plane
    @PostMapping("/planes")
    public void addPlane(@RequestBody Plane plane) {
        planeService.addPlane(plane);
    }

    // Update a plane
    @PutMapping("/planes")
    public void updatePlane(@RequestBody Plane plane) {
        planeService.updatePlane(plane);
    }

    // Delete a plane by ID
    @DeleteMapping("/planes/{id}")
    public void deletePlane(@PathVariable int id) {
        planeService.deletePlane(id);
    }

    // Update only the status of a plane
    @PatchMapping("/planes/{id}/status")
    public void updatePlaneStatus(@PathVariable int id, @RequestParam Status status) {
        planeService.updatePlaneStatus(id, status);
    }

/// flight
///
    // Lấy chuyến bay theo ID
    @GetMapping("/flights/{id}")
    public Flight getFlightById(@PathVariable int id) {
        return flightService.getFlightById(id);
    }
    // Thêm chuyến bay mới
    @PostMapping("/flights")
    public void addFlight(@RequestBody Flight flight) {
        flightService.addFlight(flight);
    }
    // Cập nhật chuyến bay (nếu có thì update, không có thì tạo mới)
    @PutMapping("/flights/{id}")
    public void updateFlight(@PathVariable int id, @RequestBody Flight flight) {
        flight.setIdFlight(id);
        flightService.updateFlight(flight);
    }
    // Xoá chuyến bay
    @DeleteMapping("/flights/{id}")
    public void deleteFlight(@PathVariable int id) {
        flightService.deleteFlight(id);
    }

}
