package in

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type UserService interface {
	FindById(ctx context.Context, id string) (*models.User, error)
}
