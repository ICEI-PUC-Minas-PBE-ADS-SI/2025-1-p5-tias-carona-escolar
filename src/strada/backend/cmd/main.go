package main

import (
	"fmt"
	"log"

	config "github.com/244Walyson/shared-ride/configs/db"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api"
	"github.com/244Walyson/shared-ride/internal/adapters/in/api/routes"
	"github.com/244Walyson/shared-ride/internal/adapters/out/repository"
	"github.com/244Walyson/shared-ride/internal/application/core/services"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	log.Print("Starting the application...")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database, err := config.ConnectDB()
	if err != nil {
		log.Fatal("Cannot connect to the database")
	}

	defer database.Close()

	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	verifyTokenRepository := repository.NewVerifyTokenRepository()

	userRepository := repository.NewUserRepository(conn)

	rideRequestRepository := repository.NewRideRequestRepository(database)
	rideRepository := repository.NewRideRepository(database)

	rideRequestService := services.NewRideRequestService(rideRequestRepository)
	rideService := services.NewRideService(rideRepository)
	userService := services.NewUserService(userRepository)

	rideService.SetRideRequestService(rideRequestService)
	rideService.SetUserService(userService)
	rideRequestService.SetRideService(rideService)
	rideRequestService.SetUserService(userService)

	// dispatcher := dispatcher.NewDispatcher()
	// dispatcher.Register("find_near_rides", dto.PayloadIdDTO{}, func(data any, ctx context.Context) (any, error) {
	// 	return rideService.FindNear(ctx, data.(dto.PayloadIdDTO).ID)
	// })
	// dispatcher.Register("create_ride", models.Ride{}, func(data any, ctx context.Context) (any, error) {
	// 	return rideService.Create(ctx, data.(*models.Ride))
	// })
	// dispatcher.Register("update_ride_status", models.RideRequest{}, func(data any, ctx context.Context) (any, error) {
	// 	return rideService.Update(ctx, data.(*models.Ride).ID, data.(*models.Ride))
	// })
	// dispatcher.Register("delete_ride", nil, func(data any, ctx context.Context) (any, error) {
	// 	return nil, rideService.Delete(ctx, data.(int32))
	// })
	// dispatcher.Register("create_ride_request", models.RideRequest{}, func(data any, ctx context.Context) (any, error) {
	// 	rideRequest, err := rideRequestService.Create(ctx, data.(*models.RideRequest))
	// 	return rideRequest, err
	// })

	//websocket := websocket.NewWebsocketRoute(dispatcher)

	createRideRequestRoute := routes.NewCreateRideRequest(rideRequestService)
	findNearRideRequestRoute := routes.NewFindNearRideRequest(rideRequestService)
	findNearRideRoute := routes.NewFindNearRide(rideService)
	createRideRoute := routes.NewCreateRide(rideService)
	findRideById := routes.NewFindRideById(rideService)
	findRideRequestById := routes.NewFindRideRequestById(rideRequestService)
	verifyTokenService := services.NewVerifyTokenService(verifyTokenRepository)

	routes := []api.Route{
		createRideRequestRoute,
		findNearRideRequestRoute,
		findNearRideRoute,
		createRideRoute,
		findRideById,
		findRideRequestById,
	}

	for _, route := range routes {
		fmt.Printf("Route: %s\n", route.GetPath())
		fmt.Printf("Method: %s\n", route.GetMethod())
		fmt.Printf("Handler: %v\n", route.GetHandler())
	}

	router := gin.Default()

	authMiddleware := api.NewAuthMiddleware(verifyTokenService)

	router.Use(authMiddleware.AuthMiddlewareHandler())

	for _, route := range routes {
		switch route.GetMethod() {
		case "GET":
			router.GET(route.GetPath(), route.GetHandler())
		case "POST":
			router.POST(route.GetPath(), route.GetHandler())
		case "PUT":
			router.PUT(route.GetPath(), route.GetHandler())
		case "DELETE":
			router.DELETE(route.GetPath(), route.GetHandler())
		default:
			fmt.Printf("Unsupported method: %s for path: %s\n", route.GetMethod(), route.GetPath())
		}
	}

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "its working"})
	})
	router.Run(":8080")

}
