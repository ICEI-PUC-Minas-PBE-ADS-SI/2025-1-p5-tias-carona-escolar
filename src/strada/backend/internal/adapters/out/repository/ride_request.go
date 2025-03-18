package repository

import (
	"context"
	"fmt"

	dbsqlc "github.com/244Walyson/shared-ride/internal/adapters/out/repository/sqlc"
	"github.com/244Walyson/shared-ride/internal/adapters/out/utils"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
	"github.com/jackc/pgx/v5/pgtype"
)

type RideRequestRepository struct {
	sqlc *dbsqlc.Queries
}

func NewRideRequestRepository(db dbsqlc.DBTX) out.RideRequestRepository {
	return &RideRequestRepository{
		sqlc: dbsqlc.New(db),
	}
}

func (r *RideRequestRepository) Create(ctx context.Context, rideRequest *models.RideRequest) (*models.RideRequest, error) {
	rideRequestRow, err := r.sqlc.CreateRideRequest(ctx, dbsqlc.CreateRideRequestParams{
		PassengerID:   rideRequest.PassengerID,
		StMakepoint:   rideRequest.Origin.Longitude,
		StMakepoint_2: rideRequest.Origin.Latitude,
		StMakepoint_3: rideRequest.Destination.Longitude,
		StMakepoint_4: rideRequest.Destination.Latitude,
		RideDatetime: pgtype.Timestamp{
			Time:  rideRequest.RideDatetime,
			Valid: true,
		},
		Description: pgtype.Text{String: rideRequest.Description, Valid: true},
	})

	if err != nil {
		fmt.Print(err)
		return nil, err
	}

	return &models.RideRequest{
		ID:           rideRequestRow.ID,
		PassengerID:  rideRequestRow.PassengerID,
		Origin:       rideRequest.Origin,
		Destination:  rideRequest.Destination,
		RideDatetime: rideRequest.RideDatetime,
		Description:  rideRequest.Description,
		Status:       rideRequest.Status,
	}, nil
}

func (r *RideRequestRepository) FindById(ctx context.Context, id int32) (*models.RideRequest, error) {
	rideRequest, err := r.sqlc.FindRideRequestByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &models.RideRequest{
		ID:           rideRequest.ID,
		PassengerID:  rideRequest.PassengerID,
		Origin:       *utils.ParsePointToLocation(rideRequest.Origin.(string)),
		Destination:  *utils.ParsePointToLocation(rideRequest.Destination.(string)),
		ImgUrl:       rideRequest.ImgUrl.String,
		RideDatetime: rideRequest.RideDatetime.Time,
		Description:  rideRequest.Description.String,
		Status:       rideRequest.Status.String,
	}, nil
}

func (r *RideRequestRepository) FindAll(ctx context.Context) ([]*models.RideRequest, error) {
	rideRequests, err := r.sqlc.FindAllRideRequests(ctx)
	if err != nil {
		return nil, err
	}

	rideRequestPtrs := make([]*models.RideRequest, len(rideRequests))
	for i := range rideRequests {
		rideRequestPtrs[i] = &models.RideRequest{
			ID:           rideRequests[i].ID,
			PassengerID:  rideRequests[i].PassengerID,
			Origin:       *utils.ParsePointToLocation(rideRequests[i].Origin.(string)),
			Destination:  *utils.ParsePointToLocation(rideRequests[i].Destination.(string)),
			ImgUrl:       rideRequests[i].ImgUrl.String,
			RideDatetime: rideRequests[i].RideDatetime.Time,
			Description:  rideRequests[i].Description.String,
			Status:       rideRequests[i].Status.String,
		}
	}

	return rideRequestPtrs, nil
}

func (r *RideRequestRepository) FindNear(ctx context.Context, locations []*models.Location) ([]*models.RideRequest, error) {
	var points []pgtype.Point

	for _, loc := range locations {
		points = append(points, pgtype.Point{
			P:     pgtype.Vec2{X: loc.Longitude, Y: loc.Latitude},
			Valid: true,
		})
	}

	rideRequests, err := r.sqlc.FindNearRideRequests(ctx, dbsqlc.FindNearRideRequestsParams{
		Column1:   points,
		StDwithin: 1000,
	})

	if err != nil {
		return nil, err
	}

	rideRequestPtrs := make([]*models.RideRequest, len(rideRequests))
	for i := range rideRequests {
		rideRequestPtrs[i] = &models.RideRequest{
			ID:           rideRequests[i].ID,
			PassengerID:  rideRequests[i].PassengerID,
			Origin:       *utils.ParsePointToLocation(rideRequests[i].Origin.(string)),
			Destination:  *utils.ParsePointToLocation(rideRequests[i].Destination.(string)),
			ImgUrl:       rideRequests[i].ImgUrl.String,
			RideDatetime: rideRequests[i].RideDatetime.Time,
			Description:  rideRequests[i].Description.String,
			Status:       rideRequests[i].Status.String,
		}
	}

	return rideRequestPtrs, nil
}

func (r *RideRequestRepository) Update(ctx context.Context, id int32, rideRequest *models.RideRequest) (*models.RideRequest, error) {
	_, err := r.sqlc.UpdateRideRequest(ctx, dbsqlc.UpdateRideRequestParams{
		ID:            id,
		PassengerID:   rideRequest.PassengerID,
		StMakepoint:   rideRequest.Origin.Latitude,
		StMakepoint_2: rideRequest.Origin.Longitude,
		StMakepoint_3: rideRequest.Destination.Latitude,
		StMakepoint_4: rideRequest.Destination.Longitude,
		ImgUrl:        pgtype.Text{String: rideRequest.ImgUrl, Valid: true},
		RideDatetime: pgtype.Timestamp{
			Time:  rideRequest.RideDatetime,
			Valid: true,
		},
		Status:      pgtype.Text{String: rideRequest.Status, Valid: true},
		Description: pgtype.Text{String: rideRequest.Description, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	return rideRequest, nil
}

func (r *RideRequestRepository) Delete(ctx context.Context, id int32) error {
	_, err := r.sqlc.DeleteRideRequest(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
