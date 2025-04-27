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
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
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

		conn.WriteJSON(response)
	}
}

func handleMessages(d *dispatcher.Dispatcher, data []byte, ctx context.Context) *dto.DispatchResponseDTO {
	binded, err := bindRequest(data)
	if err != nil {
		return &dto.DispatchResponseDTO{Command: binded.Command, Status: "error", Data: nil}
	}

	fmt.Println(binded)

	response := d.Dispatch(binded.Command, binded.Payload, ctx)

	return response
}

func bindRequest(data []byte) (dto.WebsocketRequestDTO, error) {
	var dto dto.WebsocketRequestDTO
	if err := json.Unmarshal(data, &dto); err != nil {
		log.Println("Erro ao decodificar Menssagem:", err)
		return dto, err
	}
	return dto, nil
}

func (f *WebsocketRoute) Name() string {
	return f.name
}

func (f *WebsocketRoute) Path() string {
	return f.path
}

func (f *WebsocketRoute) Method() string {
	return f.method
}
