package utils

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/244Walyson/shared-ride/configs/logger"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

func LocationToPoint(loc models.Location) pgtype.Point {
	return pgtype.Point{
		P:     pgtype.Vec2{X: loc.Longitude, Y: loc.Latitude},
		Valid: true,
	}
}

func ParsePointToLocation(pointStr string) *models.Location {
	pointStr = strings.TrimPrefix(pointStr, "POINT(")
	pointStr = strings.TrimSuffix(pointStr, ")")

	re := regexp.MustCompile(`([-\d.]+)\s([-\d.]+)`)
	matches := re.FindStringSubmatch(pointStr)
	if len(matches) < 3 {
		logger.Error("invalid point format", nil)
	}

	x, err := strconv.ParseFloat(matches[1], 64)
	if err != nil {
		logger.Error("invalid latitude", err)
	}

	y, err := strconv.ParseFloat(matches[2], 64)
	if err != nil {
		logger.Error("invalid longitude", err)
	}

	return &models.Location{Latitude: y, Longitude: x}
}
