package legado

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"math"
// 	"sync"

// 	"github.com/244Walyson/shared-ride/internal/adapters/in/dto"
// 	"github.com/244Walyson/shared-ride/internal/adapters/in/websocket/dispatcher"
// 	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
// 	"github.com/gin-gonic/gin"
// 	"github.com/gorilla/websocket"
// )

// type WebsocketRoute struct {
// 	name       string
// 	path       string
// 	method     string
// 	dispatcher dispatcher.Dispatcher
// }

// func NewWebsocketRoute(dispatcher dispatcher.Dispatcher) *WebsocketRoute {
// 	return &WebsocketRoute{
// 		name:       "WebsocketRoute",
// 		path:       "/ws",
// 		method:     "GET",
// 		dispatcher: dispatcher,
// 	}
// }

// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// }

// type RideGroup struct {
// 	locations []*models.Location
// 	clients   map[*websocket.Conn]bool
// 	mutex     sync.Mutex
// }

// type RideManager struct {
// 	Groups map[string]*RideGroup
// 	mutex  sync.Mutex
// }

// var rideManager = &RideManager{
// 	Groups: make(map[string]*RideGroup),
// }

// func haversine(lat1, lon1, lat2, lon2 float64) float64 {
// 	const R = 6371
// 	dLat := (lat2 - lat1) * (math.Pi / 180.0)
// 	dLon := (lon2 - lon1) * (math.Pi / 180.0)
// 	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
// 		math.Cos(lat1*(math.Pi/180.0))*math.Cos(lat2*(math.Pi/180.0))*
// 			math.Sin(dLon/2)*math.Sin(dLon/2)

// 	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
// 	return R * c
// }

// func isAlongRoute(ridePoint []*models.Location, request *models.RideRequest, maxDistance float64) bool {
// 	for _, waypoint := range ridePoint {
// 		if haversine(request.Origin.Latitude, request.Origin.Longitude, waypoint.Latitude, waypoint.Longitude) <= maxDistance &&
// 			haversine(request.Destination.Latitude, request.Destination.Longitude, waypoint.Latitude, waypoint.Longitude) <= maxDistance {
// 			return true
// 		}
// 	}
// 	return false
// }

// func (rm *RideManager) FindOrCreateGroup(r *models.Ride, rr *models.RideRequest, conn *websocket.Conn, maxDistance float64) *RideGroup {
// 	rm.mutex.Lock()
// 	defer rm.mutex.Unlock()

// 	if r != nil {
// 		for _, group := range rm.Groups {
// 			for _, loc := range group.locations {
// 				for _, ridePoint := range r.RidePoints {
// 					if haversine(ridePoint.Latitude, ridePoint.Longitude, loc.Latitude, loc.Longitude) <= maxDistance {
// 						group.mutex.Lock()
// 						for _, point := range r.RidePoints {
// 							group.locations = append(group.locations, &models.Location{
// 								Latitude:  point.Latitude,
// 								Longitude: point.Longitude,
// 							})
// 						}
// 						group.locations = append(group.locations, &models.Location{
// 							Latitude:  r.StartPoint.Latitude,
// 							Longitude: r.StartPoint.Longitude,
// 						})
// 						group.locations = append(group.locations, &models.Location{
// 							Latitude:  r.EndPoint.Latitude,
// 							Longitude: r.EndPoint.Longitude,
// 						})
// 						group.clients[conn] = true
// 						group.mutex.Unlock()
// 						return group
// 					}
// 				}
// 			}
// 		}
// 	}

// 	if rr != nil {
// 		for _, group := range rm.Groups {
// 			if isAlongRoute(group.locations, rr, maxDistance) {
// 				group.mutex.Lock()
// 				group.locations = append(group.locations, &rr.Origin)
// 				group.locations = append(group.locations, &rr.Destination)
// 				group.clients[conn] = true
// 				group.mutex.Unlock()
// 				return group
// 			}
// 		}
// 	}

// 	newGroup := &RideGroup{
// 		locations: []*models.Location{},
// 		clients:   make(map[*websocket.Conn]bool),
// 	}
// 	newGroup.clients[conn] = true
// 	groupID := fmt.Sprintf("group-%d", len(rm.Groups)+1)
// 	rm.Groups[groupID] = newGroup
// 	return newGroup
// }

// func (rg *RideGroup) RemoveFromGroup(conn *websocket.Conn) {
// 	rg.mutex.Lock()
// 	defer rg.mutex.Unlock()
// 	delete(rg.clients, conn)
// }

// func (rg *RideGroup) BroadcastMessage(message interface{}) {
// 	rg.mutex.Lock()
// 	defer rg.mutex.Unlock()

// 	msg, err := json.Marshal(message)
// 	if err != nil {
// 		log.Println("Erro ao codificar mensagem para broadcast:", err)
// 		return
// 	}

// 	for client := range rg.clients {
// 		if err := client.WriteMessage(websocket.TextMessage, msg); err != nil {
// 			log.Println("Erro ao enviar mensagem para cliente:", err)
// 			client.Close()
// 			delete(rg.clients, client)
// 		}
// 	}
// }

// func (f *WebsocketRoute) Handle(c *gin.Context) {
// 	ctx := c.Request.Context()
// 	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
// 	if err != nil {
// 		log.Println("Erro ao abrir conexão WebSocket:", err)
// 		return
// 	}
// 	defer conn.Close()

// 	for {
// 		_, message, err := conn.ReadMessage()
// 		if err != nil {
// 			log.Println("Erro ao ler mensagem:", err)
// 			return
// 		}

// 		response := handleMessages(f.dispatcher, message, ctx)
// 		err = conn.WriteJSON(response)
// 		if err != nil {
// 			log.Println("Erro ao enviar resposta:", err)
// 			return
// 		}
// 	}
// }

// func handleMessages(d dispatcher.Dispatcher, data []byte, ctx context.Context) *dto.DispatchResponseDTO {
// 	request, err := bindRequest(data)
// 	if err != nil {
// 		return &dto.DispatchResponseDTO{Command: "error", Status: "error", Data: nil}
// 	}
// 	return d.Dispatch(request.Command, request.Payload, ctx)
// }

// func bindRequest(data []byte) (dto.WebsocketRequestDTO, error) {
// 	var dto dto.WebsocketRequestDTO
// 	if err := json.Unmarshal(data, &dto); err != nil {
// 		log.Println("Erro ao decodificar mensagem:", err)
// 		return dto, err
// 	}
// 	return dto, nil
// }

// func (f *WebsocketRoute) Name() string {
// 	return f.name
// }

// func (f *WebsocketRoute) Path() string {
// 	return f.path
// }

// func (f *WebsocketRoute) Method() string {
// 	return f.method
// }
