package dto

import (
	"time"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type RideRequestDto struct {
	ID           int32       `json:"id"`
	PassengerID  string      `json:"passengerId"`
	Origin       LocationDto `json:"origin"`
	Destination  LocationDto `json:"destination"`
	RideDatetime time.Time   `json:"rideDatetime"`
	Status       string      `json:"status"`
	Description  string      `json:"description"`
	ImgUrl       string      `json:"imgUrl"`
}

func (r *RideRequestDto) ToModel() *models.RideRequest {
	return &models.RideRequest{
		ID:           r.ID,
		PassengerID:  r.PassengerID,
		Origin:       *r.Origin.ToModel(),
		Destination:  *r.Destination.ToModel(),
		RideDatetime: r.RideDatetime,
		Status:       r.Status,
		Description:  r.Description,
		ImgUrl:       r.ImgUrl,
	}
}

func ToRideRequestDto(r *models.RideRequest) *RideRequestDto {
	return &RideRequestDto{
		ID:           r.ID,
		PassengerID:  r.PassengerID,
		Origin:       *ToLocationDto(&r.Origin),
		Destination:  *ToLocationDto(&r.Destination),
		RideDatetime: r.RideDatetime,
		Status:       r.Status,
		Description:  r.Description,
		ImgUrl:       r.ImgUrl,
	}
}

func ToRideRequestDtoList(models []*models.RideRequest) []RideRequestDto {
	dtos := make([]RideRequestDto, len(models))
	for i, model := range models {
		dtos[i] = *ToRideRequestDto(model)
	}
	return dtos
}
