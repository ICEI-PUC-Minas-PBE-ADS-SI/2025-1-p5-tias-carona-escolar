package services

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
)

type VerifyTokenService struct {
	VerifyTokenRepository out.VerifyTokenRepository
}

func NewVerifyTokenService(r out.VerifyTokenRepository) in.VerifyTokenService {
	return &VerifyTokenService{
		VerifyTokenRepository: r,
	}
}

func (s *VerifyTokenService) VerifyToken(ctx context.Context, verifyToken string) (*models.User, error) {
	return s.VerifyTokenRepository.VerifyToken(ctx, verifyToken)
}
