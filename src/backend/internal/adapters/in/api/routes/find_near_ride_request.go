package routes

import (
	"fmt"
	"strconv"

	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type FindNearRideRequest struct {
	path    string
	method  string
	service in.RideRequestService
}

func NewFindNearRideRequest(s in.RideRequestService) api.Route {
	return &FindNearRideRequest{
		path:    "/ride-request/near/:rideId",
		method:  "GET",
		service: s,
	}
}

func (c *FindNearRideRequest) GetPath() string {
	return c.path
}

func (c *FindNearRideRequest) GetMethod() string {
	return c.method
}

func (c *FindNearRideRequest) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		rideIdStr := cc.Param("rideId")
		fmt.Print("FindNearRideRequest rideIdStr: ", rideIdStr)
		rideId, err := strconv.Atoi(rideIdStr)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("Invalid rideId"))
			return
		}

		ridesRequests, err := c.service.FindNear(ctx, int32(rideId))
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError(err.Error()))
			return
		}
		cc.JSON(200, dto.ToRideRequestDtoList(ridesRequests))

	}
}
