package out

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type RideRequestRepository interface {
	Create(ctx context.Context, rideRequest *models.RideRequest) (*models.RideRequest, error)
	FindById(ctx context.Context, id int32) (*models.RideRequest, error)
	FindAll(ctx context.Context) ([]*models.RideRequest, error)
	FindNear(ctx context.Context, locations []*models.Location) ([]*models.RideRequest, error)
	Update(ctx context.Context, id int32, rideRequest *models.RideRequest) (*models.RideRequest, error)
	Delete(ctx context.Context, id int32) error
}
