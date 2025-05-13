package dto

import models "github.com/244Walyson/shared-ride/internal/application/core/domain"

type LocationDto struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

func (l *LocationDto) ToModel() *models.Location {
	return &models.Location{
		Latitude:  l.Latitude,
		Longitude: l.Longitude,
	}
}

func ToLocationDto(l *models.Location) *LocationDto {
	return &LocationDto{
		Latitude:  l.Latitude,
		Longitude: l.Longitude,
	}
}

func ToLocationDtoList(models []models.Location) []LocationDto {
	dtos := make([]LocationDto, len(models))
	for i, model := range models {
		dtos[i] = *ToLocationDto(&model)
	}
	return dtos
}

func ToModelLocationDtoList(dtos []LocationDto) []models.Location {
	models := make([]models.Location, len(dtos))
	for i, dto := range dtos {
		models[i] = *dto.ToModel()
	}
	return models
}
