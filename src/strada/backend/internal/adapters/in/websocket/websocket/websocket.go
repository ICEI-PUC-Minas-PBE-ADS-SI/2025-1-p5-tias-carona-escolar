package websocket

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"github.com/244Walyson/shared-ride/internal/adapters/in/websocket/dispatcher"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WebsocketRoute struct {
	name       string
	path       string
	method     string
	dispatcher *dispatcher.Dispatcher
}

func NewWebsocketRoute(dispatcher *dispatcher.Dispatcher) *WebsocketRoute {
	return &WebsocketRoute{
		name:       "WebsocketRoute",
		path:       "/ws",
		method:     "GET",
		dispatcher: dispatcher,
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (f *WebsocketRoute) Handle(c *gin.Context, d *dispatcher.Dispatcher) {
	ctx := c.Request.Context()
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(400, gin.H{"error": "user_id is required"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	manager := dispatcher.GetConnectionManager()
	manager.Add(userID, conn)

	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		response := handleMessages(d, message, ctx)

		privateConn, ok := manager.Get(response.TargetID)

		if !ok {
			log.Println("Connection not found for user:", response.TargetID)
			continue
		}
		privateConn.WriteJSON(response)
	}
}

func handleMessages(d *dispatcher.Dispatcher, data []byte, ctx context.Context) *dto.DispatchResponseDTO {
	binded, err := bindRequest(data)
	if err != nil {
		return &dto.DispatchResponseDTO{Command: binded.Command, Status: "error", Data: nil}
	}

	fmt.Println(binded)

	response := d.Dispatch(binded.Command, binded.Payload, ctx)

	return &dto.DispatchResponseDTO{
		Command:  binded.Command,
		Status:   response.Status,
		Data:     response.Data,
		TargetID: binded.TargetID,
	}
}

func bindRequest(data []byte) (dto.WebsocketRequestDTO, error) {
	var dto dto.WebsocketRequestDTO
	if err := json.Unmarshal(data, &dto); err != nil {
		log.Println("Erro ao decodificar Menssagem:", err)
		return dto, err
	}
	return dto, nil
}

func (f *WebsocketRoute) GetName() string {
	return f.name
}

func (f *WebsocketRoute) GetPath() string {
	return f.path
}

func (f *WebsocketRoute) GetMethod() string {
	return f.method
}

func (f *WebsocketRoute) GetHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		f.Handle(c, f.dispatcher)
	}
}
