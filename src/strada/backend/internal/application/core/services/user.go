package services

import (
	"context"

	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
)

type UserService struct {
	repository out.UserRepository
}

func NewUserService(r out.UserRepository) in.UserService {
	return &UserService{
		repository: r,
	}
}

func (s *UserService) FindById(ctx context.Context, id string) (*models.User, error) {
	return s.repository.FindById(ctx, id)
}
