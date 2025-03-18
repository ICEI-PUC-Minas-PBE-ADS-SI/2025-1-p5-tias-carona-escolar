package routes

import (
	"strconv"

	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
)

type FindRideRequestById struct {
	path    string
	method  string
	service in.RideRequestService
}

func NewFindRideRequestById(s in.RideRequestService) api.Route {
	return &FindRideRequestById{
		path:    "/ride-request/:riderequestId",
		method:  "GET",
		service: s,
	}
}

func (c *FindRideRequestById) GetPath() string {
	return c.path
}

func (c *FindRideRequestById) GetMethod() string {
	return c.method
}

func (c *FindRideRequestById) GetHandler() gin.HandlerFunc {
	return func(cc *gin.Context) {
		ctx := cc.Request.Context()

		rideIdStr := cc.Param("riderequestId")
		rideId, err := strconv.Atoi(rideIdStr)
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError("Invalid rideId"))
			return
		}
		rideRequest, err := c.service.FindById(ctx, int32(rideId))
		if err != nil {
			cc.JSON(400, rest_err.NewBadRequestError(err.Error()))
			return
		}
		cc.JSON(200, dto.ToRideRequestDto(rideRequest))

	}
}
