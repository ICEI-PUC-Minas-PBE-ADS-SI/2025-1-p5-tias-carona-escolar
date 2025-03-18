package in

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type RideService interface {
	Create(ctx context.Context, ride *models.Ride) (*models.Ride, error)
	FindById(ctx context.Context, id int32) (*models.Ride, error)
	FindAll(ctx context.Context) ([]*models.Ride, error)
	FindNear(ctx context.Context, rideId int32) ([]*models.Ride, error)
	Update(ctx context.Context, id int32, ride *models.Ride) (*models.Ride, error)
	Delete(ctx context.Context, id int32) error

	SetRideRequestService(rideRequestService RideRequestService)
	SetUserService(userService UserService)
}
