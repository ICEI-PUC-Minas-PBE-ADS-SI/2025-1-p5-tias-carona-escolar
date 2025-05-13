package routes

import (
	"strconv"

	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type FindNearRide struct {
	path    string
	method  string
	service in.RideService
}

func NewFindNearRide(s in.RideService) api.Route {
	return &FindNearRide{
		path:    "/ride/near/:rideRequestId",
		method:  "GET",
		service: s,
	}
}

func (c *FindNearRide) GetPath() string {
	return c.path
}

func (c *FindNearRide) GetMethod() string {
	return c.method
}

func (c *FindNearRide) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		rideIdStr := cc.Param("rideRequestId")
		rideId, err := strconv.Atoi(rideIdStr)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("Invalid rideId"))
			return
		}

		rides, err := c.service.FindNear(ctx, int32(rideId))
		if err != nil {
			cc.JSON(400, gin.H{"error": err.Error()})
			return
		}
		cc.JSON(200, dto.ToRideDtoList(rides))
	}
}
