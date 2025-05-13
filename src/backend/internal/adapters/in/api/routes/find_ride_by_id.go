package routes

import (
	"strconv"

	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type FindRideById struct {
	path    string
	method  string
	service in.RideService
}

func NewFindRideById(s in.RideService) api.Route {
	return &FindRideById{
		path:    "/ride/:rideId",
		method:  "GET",
		service: s,
	}
}

func (c *FindRideById) GetPath() string {
	return c.path
}

func (c *FindRideById) GetMethod() string {
	return c.method
}

func (c *FindRideById) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		rideIdStr := cc.Param("rideId")
		rideId, err := strconv.Atoi(rideIdStr)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("Invalid rideId"))
			return
		}

		ride, err := c.service.FindById(ctx, int32(rideId))
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError(err.Error()))
			return
		}
		cc.JSON(200, dto.ToRideDto(ride))

	}
}
