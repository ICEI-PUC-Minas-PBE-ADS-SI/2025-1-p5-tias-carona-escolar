package routes

import (
	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type CreateRideRequest struct {
	path    string
	method  string
	service in.RideRequestService
}

func NewCreateRideRequest(s in.RideRequestService) api.Route {
	return &CreateRideRequest{
		path:    "/ride-request",
		method:  "POST",
		service: s,
	}
}

func (c *CreateRideRequest) GetPath() string {
	return c.path
}

func (c *CreateRideRequest) GetMethod() string {
	return c.method
}

func (c *CreateRideRequest) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		var rideRequestDto dto.RideRequestDto
		err := cc.BindJSON(&rideRequestDto)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("invalid json body"))
			return
		}
		ride := rideRequestDto.ToModel()
		created, err := c.service.Create(ctx, ride)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError(err.Error()))
			return
		}
		cc.JSON(201, dto.ToRideRequestDto(created))
	}
}
