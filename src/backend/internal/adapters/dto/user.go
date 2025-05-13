package dto

import (
	proto "github.com/244Walyson/shared-ride/internal/adapters/out/repository/grpc"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
)

type UserDto struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	ImgUrl   string `json:"imgUrl"`
}

func (u *UserDto) ToModel() *models.User {
	return &models.User{
		ID:       u.ID,
		Name:     u.Name,
		Email:    u.Email,
		Username: u.Username,
		ImgUrl:   u.ImgUrl,
	}
}

func ToUserDto(user *models.User) *UserDto {
	return &UserDto{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		Username: user.Username,
		ImgUrl:   user.ImgUrl,
	}
}

func ToModelFromUserResponseDto(dto *proto.FindUserResponseDto) *models.User {
	return &models.User{
		ID:       dto.Id,
		Name:     dto.Name,
		Email:    dto.Email,
		Username: dto.Username,
		ImgUrl:   dto.ImgUrl,
	}
}
