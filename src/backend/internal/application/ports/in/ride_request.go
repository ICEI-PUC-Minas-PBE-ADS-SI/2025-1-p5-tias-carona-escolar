package in

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type RideRequestService interface {
	Create(ctx context.Context, rideRequest *models.RideRequest) (*models.RideRequest, error)
	FindById(ctx context.Context, id int32) (*models.RideRequest, error)
	FindAll(ctx context.Context) ([]*models.RideRequest, error)
	FindNear(ctx context.Context, rideRequestId int32) ([]*models.RideRequest, error)
	Update(ctx context.Context, id int32, rideRequest *models.RideRequest) (*models.RideRequest, error)
	Delete(ctx context.Context, id int32) error

	SetRideService(rideService RideService)
	SetUserService(userService UserService)
}
