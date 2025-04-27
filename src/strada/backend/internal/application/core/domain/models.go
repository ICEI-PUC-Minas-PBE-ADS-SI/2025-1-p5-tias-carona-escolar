package models

import "time"

type Location struct {
	Latitude  float64
	Longitude float64
}

type Ride struct {
	ID              int32
	StartPoint      Location
	EndPoint        Location
	Distance        int32
	EstimatedTimeMs int32
	Co2Emission     int32
	Cost            int32
	Description     string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	StopPoints      []Location
	ImgUrl          string
	DriverID        string
	VehicleID       int32
}

type RidePassenger struct {
	RideID     int32
	UserID     string
	CreatedAt  time.Time
	StartPoint Location
	EndPoint   Location
	Role       string
}

type RideRequest struct {
	ID           int32
	PassengerID  string
	Origin       Location
	Destination  Location
	Description  string
	RideDatetime time.Time
	DriveOfferID int32
	ImgUrl       string
	Status       string
}

type TbDriverOffer struct {
	ID                int32
	DriverID          string
	AvailableSeats    int32
	Origin            Location
	Destination       Location
	AvailableDatetime time.Time
	RideDatetime      time.Time
	RideID            int32
	Status            string
}

type User struct {
	ID       string
	Name     string
	Email    string
	Username string
	ImgUrl   string
}
