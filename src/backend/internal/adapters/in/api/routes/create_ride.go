package routes

import (
	"fmt"

	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type CreateRide struct {
	path    string
	method  string
	service in.RideService
}

func NewCreateRide(s in.RideService) api.Route {
	return &CreateRide{
		path:    "/ride",
		method:  "POST",
		service: s,
	}
}

func (c *CreateRide) GetPath() string {
	return c.path
}

func (c *CreateRide) GetMethod() string {
	return c.method
}

func (c *CreateRide) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		var rideDto dto.RideDto
		err := cc.BindJSON(&rideDto)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("invalid json body"))
			return
		}

		fmt.Printf("CreateRideDTO: %+v\n", rideDto)

		ride := rideDto.ToModel()

		fmt.Printf("CreateRide: %+v\n", ride)

		created, err := c.service.Create(ctx, ride)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError(err.Error()))
			return
		}
		cc.JSON(201, dto.ToRideDto(created))
	}
}
