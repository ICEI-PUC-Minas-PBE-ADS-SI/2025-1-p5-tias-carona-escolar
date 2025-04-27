package out

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type VerifyTokenRepository interface {
	VerifyToken(ctx context.Context, token string) (*models.User, error)
}
