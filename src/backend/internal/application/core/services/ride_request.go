package services

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	in "github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
)

type RideRequestService struct {
	rideRequestRepository out.RideRequestRepository
	rideRpository         in.RideService
	UserService           in.UserService
}

func NewRideRequestService(rideRequestRepository out.RideRequestRepository) in.RideRequestService {
	return &RideRequestService{
		rideRequestRepository: rideRequestRepository,
	}
}

func (s *RideRequestService) SetRideService(rideService in.RideService) {
	s.rideRpository = rideService
}

func (s *RideRequestService) SetUserService(userService in.UserService) {
	s.UserService = userService
}

func (s *RideRequestService) Create(ctx context.Context, rideRequest *models.RideRequest) (*models.RideRequest, error) {
	user, err := s.UserService.FindById(ctx, rideRequest.PassengerID)
	if err != nil {
		return nil, err
	}
	rideRequest.PassengerID = user.ID
	return s.rideRequestRepository.Create(ctx, rideRequest)
}

func (s *RideRequestService) FindById(ctx context.Context, id int32) (*models.RideRequest, error) {
	return s.rideRequestRepository.FindById(ctx, id)
}

func (s *RideRequestService) FindAll(ctx context.Context) ([]*models.RideRequest, error) {
	return s.rideRequestRepository.FindAll(ctx)
}

func (s *RideRequestService) FindNear(ctx context.Context, rideId int32) ([]*models.RideRequest, error) {
	ride, err := s.rideRpository.FindById(ctx, rideId)

	if err != nil {
		return nil, err
	}
	locations := make([]*models.Location, len(ride.StopPoints))
	for i, sp := range ride.StopPoints {
		locations[i] = &models.Location{
			Latitude:  sp.Latitude,
			Longitude: sp.Longitude,
		}
	}

	return s.rideRequestRepository.FindNear(ctx, locations)
}

func (s *RideRequestService) Update(ctx context.Context, id int32, rideRequest *models.RideRequest) (*models.RideRequest, error) {
	return s.rideRequestRepository.Update(ctx, id, rideRequest)
}

func (s *RideRequestService) Delete(ctx context.Context, id int32) error {
	return s.rideRequestRepository.Delete(ctx, id)
}
