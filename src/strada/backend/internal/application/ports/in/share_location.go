package in

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type ShareLocation interface {
	ShareLocationHandler(ctx context.Context, rideID int32, location *models.Location) (*models.Location, error)
}
