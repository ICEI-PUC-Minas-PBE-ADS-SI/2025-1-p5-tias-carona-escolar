package services

import (
	"context"
	"fmt"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	in "github.com/244Walyson/shared-ride/internal/application/ports/in"
	out "github.com/244Walyson/shared-ride/internal/application/ports/out"
)

type RideService struct {
	rideRepository     out.RideRepository
	rideRequestService in.RideRequestService
	UserService        in.UserService
}

func NewRideService(rideRepository out.RideRepository) in.RideService {
	return &RideService{
		rideRepository: rideRepository,
	}
}

func (s *RideService) SetRideRequestService(rideRequestService in.RideRequestService) {
	s.rideRequestService = rideRequestService
}

func (s *RideService) SetUserService(userService in.UserService) {
	s.UserService = userService
}

func (s *RideService) Create(ctx context.Context, ride *models.Ride) (*models.Ride, error) {
	user, err := s.UserService.FindById(ctx, ride.DriverID)
	if err != nil {
		return nil, err
	}
	ride.DriverID = user.ID
	ride.StopPoints = append(ride.StopPoints, ride.EndPoint)
	return s.rideRepository.Create(ctx, ride)
}

func (s *RideService) FindById(ctx context.Context, id int32) (*models.Ride, error) {
	return s.rideRepository.FindById(ctx, id)
}

func (s *RideService) FindAll(ctx context.Context) ([]*models.Ride, error) {
	return s.rideRepository.FindAll(ctx)
}

func (s *RideService) FindNear(ctx context.Context, rideRequestId int32) ([]*models.Ride, error) {
	rideReequest, err := s.rideRequestService.FindById(ctx, rideRequestId)

	fmt.Printf("ride req %v\n", rideReequest)
	if err != nil {
		return nil, err
	}
	locations := []*models.Location{&rideReequest.Origin, &rideReequest.Destination}
	return s.rideRepository.FindNear(ctx, locations)
}

func (s *RideService) Update(ctx context.Context, id int32, ride *models.Ride) (*models.Ride, error) {
	return s.rideRepository.Update(ctx, id, ride)
}

func (s *RideService) Delete(ctx context.Context, id int32) error {
	return s.rideRepository.Delete(ctx, id)
}
