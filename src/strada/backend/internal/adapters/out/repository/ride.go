package repository

import (
	"context"
	"fmt"
	"math/big"
	"regexp"
	"strconv"
	"strings"

	dbsqlc "github.com/244Walyson/shared-ride/internal/adapters/out/repository/sqlc"
	"github.com/244Walyson/shared-ride/internal/adapters/out/utils"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
	"github.com/jackc/pgx/v5/pgtype"
)

type RideRepository struct {
	sqlc *dbsqlc.Queries
}

func NewRideRepository(db dbsqlc.DBTX) out.RideRepository {
	return &RideRepository{
		sqlc: dbsqlc.New(db),
	}
}

func (r *RideRepository) Create(ctx context.Context, ride *models.Ride) (*models.Ride, error) {
	var stopPoints []string

	for _, loc := range ride.StopPoints {
		stopPoints = append(stopPoints, fmt.Sprintf("(%f %f)", loc.Longitude, loc.Latitude))
	}

	multiPoint := fmt.Sprintf("MULTIPOINT(%s)", strings.Join(stopPoints, ", "))

	rideRow, err := r.sqlc.CreateRide(ctx, dbsqlc.CreateRideParams{
		DriverID:        ride.DriverID,
		VehicleID:       int32(ride.VehicleID),
		StMakepoint:     ride.StartPoint.Longitude,
		StMakepoint_2:   ride.StartPoint.Latitude,
		StMakepoint_3:   ride.EndPoint.Longitude,
		StMakepoint_4:   ride.EndPoint.Latitude,
		StopPoints:      multiPoint,
		Description:     pgtype.Text{String: ride.Description, Valid: true},
		Distance:        pgtype.Numeric{Int: big.NewInt(int64(ride.Distance)), Valid: true},
		EstimatedTimeMs: int32(ride.EstimatedTimeMs),
		Co2Emission:     pgtype.Numeric{Int: big.NewInt(int64(ride.Co2Emission)), Valid: true},
		Cost:            pgtype.Numeric{Int: big.NewInt(int64(ride.Cost * 100)), Valid: true},
		ImgUrl:          pgtype.Text{String: ride.ImgUrl, Valid: true},
	})
	if err != nil {
		return nil, err
	}
	ride.ID = rideRow.ID
	return ride, nil
}

func (r *RideRepository) FindNear(ctx context.Context, locations []*models.Location) ([]*models.Ride, error) {

	var points []pgtype.Point

	for _, loc := range locations {
		points = append(points, pgtype.Point{
			P:     pgtype.Vec2{X: loc.Longitude, Y: loc.Latitude},
			Valid: true,
		})
	}

	rides, err := r.sqlc.FindNearRides(ctx, dbsqlc.FindNearRidesParams{
		Column1:   points,
		StDwithin: 1000,
	})

	if err != nil {
		return nil, err
	}

	var ridePtrs []*models.Ride

	for i := range rides {
		ridePtrs = append(ridePtrs, &models.Ride{
			ID:              rides[i].ID,
			DriverID:        rides[i].DriverID,
			VehicleID:       rides[i].VehicleID,
			StartPoint:      *utils.ParsePointToLocation(rides[i].StartPoint.(string)),
			EndPoint:        *utils.ParsePointToLocation(rides[i].EndPoint.(string)),
			Distance:        int32(rides[i].Distance.Int.Int64()),
			EstimatedTimeMs: int32(rides[i].EstimatedTimeMs),
			Co2Emission:     int32(rides[i].Co2Emission.Int.Int64()),
			Cost:            int32(rides[i].Cost.Int.Int64()),
			Description:     rides[i].Description.String,
			CreatedAt:       rides[i].CreatedAt.Time,
			UpdatedAt:       rides[i].UpdatedAt.Time,
			ImgUrl:          rides[i].ImgUrl.String,
		})
	}

	return ridePtrs, nil
}

func (r *RideRepository) FindById(ctx context.Context, id int32) (*models.Ride, error) {
	ride, err := r.sqlc.FindRideByID(ctx, id)
	if err != nil {
		return nil, err
	}

	locations, err := ParseMultiPointToLocations(ride.StopPoints.(string))
	if err != nil {
		return nil, err
	}

	return &models.Ride{
		ID:              ride.ID,
		DriverID:        ride.DriverID,
		VehicleID:       ride.VehicleID,
		StartPoint:      *utils.ParsePointToLocation(ride.StartPoint.(string)),
		EndPoint:        *utils.ParsePointToLocation(ride.EndPoint.(string)),
		Distance:        int32(ride.Distance.Int.Int64()),
		EstimatedTimeMs: int32(ride.EstimatedTimeMs),
		Co2Emission:     int32(ride.Co2Emission.Int.Int64()),
		Cost:            int32(ride.Cost.Int.Int64()),
		StopPoints:      locations,
		ImgUrl:          ride.ImgUrl.String,
		Description:     ride.Description.String,
		CreatedAt:       ride.CreatedAt.Time,
		UpdatedAt:       ride.UpdatedAt.Time,
	}, nil
}

func (r *RideRepository) FindAll(ctx context.Context) ([]*models.Ride, error) {
	rides, err := r.sqlc.FindAllRides(ctx)
	if err != nil {
		return nil, err
	}
	ridePtrs := make([]*models.Ride, len(rides))
	for i := range rides {
		ridePtrs[i] = &models.Ride{
			ID:              rides[i].ID,
			DriverID:        rides[i].DriverID,
			VehicleID:       rides[i].VehicleID,
			StartPoint:      *utils.ParsePointToLocation(rides[i].StartPoint.(string)),
			EndPoint:        *utils.ParsePointToLocation(rides[i].EndPoint.(string)),
			Distance:        int32(rides[i].Distance.Int.Int64()),
			EstimatedTimeMs: int32(rides[i].EstimatedTimeMs),
			Co2Emission:     int32(rides[i].Co2Emission.Int.Int64()),
			Cost:            int32(rides[i].Cost.Int.Int64()),
			Description:     rides[i].Description.String,
			CreatedAt:       rides[i].CreatedAt.Time,
			UpdatedAt:       rides[i].UpdatedAt.Time,
			ImgUrl:          rides[i].ImgUrl.String,
		}
	}
	return ridePtrs, nil
}

func (r *RideRepository) Update(ctx context.Context, id int32, ride *models.Ride) (*models.Ride, error) {
	return nil, nil
}

func (r *RideRepository) Delete(ctx context.Context, id int32) error {
	return nil
}

func ParseMultiPointToLocations(multiPoint string) ([]models.Location, error) {
	if !strings.HasPrefix(multiPoint, "MULTIPOINT(") || !strings.HasSuffix(multiPoint, ")") {
		return nil, fmt.Errorf("formato MULTIPOINT inválido: %s", multiPoint)
	}

	multiPoint = strings.TrimPrefix(multiPoint, "MULTIPOINT(")
	multiPoint = strings.TrimSuffix(multiPoint, ")")

	rawPoints := strings.Split(multiPoint, ",")
	if len(rawPoints) == 0 {
		return nil, fmt.Errorf("nenhum ponto encontrado em: %s", multiPoint)
	}

	locations := make([]models.Location, 0, len(rawPoints))
	re := regexp.MustCompile(`^-?\d+\.\d+\s+-?\d+\.\d+$`)

	for _, point := range rawPoints {
		point = strings.TrimSpace(strings.Trim(point, "()"))
		if !re.MatchString(point) {
			return nil, fmt.Errorf("ponto inválido: %s", point)
		}

		coords := strings.Fields(point)

		if len(coords) != 2 {
			return nil, fmt.Errorf("coordenadas inválidas: %s", point)
		}

		longitude, err := strconv.ParseFloat(coords[0], 64)
		if err != nil {
			return nil, fmt.Errorf("erro ao converter longitude: %v", err)
		}
		latitude, err := strconv.ParseFloat(coords[1], 64)
		if err != nil {
			return nil, fmt.Errorf("erro ao converter latitude: %v", err)
		}

		locations = append(locations, models.Location{
			Longitude: longitude,
			Latitude:  latitude,
		})
	}

	return locations, nil
}
