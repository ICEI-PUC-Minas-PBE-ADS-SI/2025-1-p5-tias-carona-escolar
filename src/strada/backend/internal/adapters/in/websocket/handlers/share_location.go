package handlers

import (
	"context"

	"github.com/244Walyson/shared-ride/internal/adapters/dto"
)

func ShareLocationHandler(data dto.LocationDto, ctx context.Context) (*dto.LocationDto, error) {
	return &data, nil
}
