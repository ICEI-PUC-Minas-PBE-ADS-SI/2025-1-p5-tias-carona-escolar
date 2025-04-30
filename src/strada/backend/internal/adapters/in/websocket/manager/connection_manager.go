package manager

import (
	"sync"

	"github.com/gorilla/websocket"
)

type ConnectionManager struct {
	connections map[string]*websocket.Conn
	lock        sync.RWMutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[string]*websocket.Conn),
	}
}

func (m *ConnectionManager) Add(userID string, conn *websocket.Conn) {
	m.lock.Lock()
	defer m.lock.Unlock()
	m.connections[userID] = conn
}

func (m *ConnectionManager) Remove(userID string) {
	m.lock.Lock()
	defer m.lock.Unlock()
	delete(m.connections, userID)
}

func (m *ConnectionManager) Get(userID string) (*websocket.Conn, bool) {
	m.lock.RLock()
	defer m.lock.RUnlock()
	conn, ok := m.connections[userID]
	return conn, ok
}
