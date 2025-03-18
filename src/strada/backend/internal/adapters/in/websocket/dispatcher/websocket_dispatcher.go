package dispatcher

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/244Walyson/shared-ride/configs/logger"
	"github.com/244Walyson/shared-ride/internal/adapters/dto"
	"go.uber.org/zap"
)

type HandlerFunc func(data any, ctx context.Context) (any, error)

type CommandHandler struct {
	ExpectedType reflect.Type
	Handler      HandlerFunc
}

type Dispatcher struct {
	handlers map[string]CommandHandler
}

func NewDispatcher() *Dispatcher {
	return &Dispatcher{
		handlers: make(map[string]CommandHandler),
	}
}

func (d *Dispatcher) Register(command string, expectedType any, fn HandlerFunc) {
	d.handlers[command] = CommandHandler{
		ExpectedType: reflect.TypeOf(expectedType),
		Handler:      fn,
	}
}

func (d *Dispatcher) Dispatch(command string, rawData json.RawMessage, ctx context.Context) *dto.DispatchResponseDTO {
	logger.Info("dispatching command", zap.String("command", command))
	handler, ok := d.handlers[command]
	if !ok {
		logger.Error("command not found", fmt.Errorf("command %s not found", command))
		return &dto.DispatchResponseDTO{Command: command, Status: "error", Data: "command not found"}
	}

	data := reflect.New(handler.ExpectedType).Interface()

	if err := json.Unmarshal(rawData, &data); err != nil {
		return &dto.DispatchResponseDTO{Command: command, Status: "error", Data: nil}
	}

	result, err := handler.Handler(data, ctx)
	if err != nil {
		return &dto.DispatchResponseDTO{Command: command, Status: "error", Data: nil}
	}

	return &dto.DispatchResponseDTO{
		Command: command,
		Status:  "success",
		Data:    result,
	}
}
