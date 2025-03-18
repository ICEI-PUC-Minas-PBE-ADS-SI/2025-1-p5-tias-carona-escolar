package dto

import (
	"time"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type RideDto struct {
	ID                 int32         `json:"id"`
	DriverID           string        `json:"driverId"`
	VehicleID          int32         `json:"vehicleId"`
	StartPoint         LocationDto   `json:"startPoint"`
	EndPoint           LocationDto   `json:"endPoint"`
	Distance           int32         `json:"distance"`
	EstimatedTimeMs    int32         `json:"estimatedTimeMs"`
	Co2Emission        int32         `json:"co2Emission"`
	Cost               int32         `json:"cost"`
	SustainableRouteID int32         `json:"sustainableRouteId"`
	StopPoints         []LocationDto `json:"stopPoints"`
	Description        string        `json:"description"`
	CreatedAt          time.Time     `json:"createdAt"`
	UpdatedAt          time.Time     `json:"updatedAt"`
	ImgUrl             string        `json:"imgUrl"`
}

func (r *RideDto) ToModel() *models.Ride {
	return &models.Ride{
		ID:              r.ID,
		DriverID:        r.DriverID,
		StartPoint:      *r.StartPoint.ToModel(),
		EndPoint:        *r.EndPoint.ToModel(),
		Distance:        r.Distance,
		EstimatedTimeMs: r.EstimatedTimeMs,
		Co2Emission:     r.Co2Emission,
		Cost:            r.Cost,
		StopPoints:      ToModelLocationDtoList(r.StopPoints),
		Description:     r.Description,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
		ImgUrl:          r.ImgUrl,
	}
}

func ToRideDto(r *models.Ride) *RideDto {
	return &RideDto{
		ID:              r.ID,
		DriverID:        r.DriverID,
		StartPoint:      *ToLocationDto(&r.StartPoint),
		EndPoint:        *ToLocationDto(&r.EndPoint),
		Distance:        r.Distance,
		EstimatedTimeMs: r.EstimatedTimeMs,
		Co2Emission:     r.Co2Emission,
		Description:     r.Description,
		Cost:            r.Cost,
		ImgUrl:          r.ImgUrl,
		CreatedAt:       r.CreatedAt,
		StopPoints:      ToLocationDtoList(r.StopPoints),
		UpdatedAt:       r.UpdatedAt,
	}
}

func ToRideDtoList(rides []*models.Ride) []*RideDto {
	rideDtos := make([]*RideDto, len(rides))
	for i := range rides {
		rideDtos[i] = ToRideDto(rides[i])
	}
	return rideDtos
}
