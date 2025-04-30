package services

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
)

type ShareLocationService struct{}

func NewShareLocationService() in.ShareLocation {
	return &ShareLocationService{}
}

func (s *ShareLocationService) ShareLocationHandler(ctx context.Context, rideID int32, location *models.Location) (*models.Location, error) {
	return &models.Location{
		Latitude:  location.Latitude,
		Longitude: location.Longitude,
	}, nil
}
