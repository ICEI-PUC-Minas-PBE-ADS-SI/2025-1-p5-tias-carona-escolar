package dto

import "encoding/json"

type WebsocketRequestDTO struct {
	Command  string          `json:"command"`
	Payload  json.RawMessage `json:"payload"`
	TargetID string          `json:"target_id"`
}

type DispatchResponseDTO struct {
	Command  string `json:"command"`
	Status   string `json:"status"`
	Data     any    `json:"data"`
	TargetID string `json:"target_id"`
}

type PayloadIdDTO struct {
	ID int32 `json:"id"`
}
