package repository

import (
	"context"

	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	proto "github.com/244Walyson/shared-ride/internal/adapters/out/repository/grpc"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
	"google.golang.org/grpc"
)

type UserRepository struct {
	client proto.UserServiceClient
}

func NewUserRepository(c *grpc.ClientConn) out.UserRepository {
	return &UserRepository{
		client: proto.NewUserServiceClient(c),
	}
}

func (r *UserRepository) FindById(ctx context.Context, id string) (*models.User, error) {
	req := &proto.FindUserRequestDto{
		Id: id,
	}

	res, err := r.client.FindById(ctx, req)
	if err != nil {
		return nil, err
	}
	return dto.ToModelFromUserResponseDto(res), nil
}
