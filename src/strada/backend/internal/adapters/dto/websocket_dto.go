package dto

import "encoding/json"

type WebsocketRequestDTO struct {
	Command string          `json:"command"`
	Payload json.RawMessage `json:"payload"`
}

type DispatchResponseDTO struct {
	Command string `json:"command"`
	Status  string `json:"status"`
	Data    any    `json:"data"`
}

type PayloadIdDTO struct {
	ID int32 `json:"id"`
}
