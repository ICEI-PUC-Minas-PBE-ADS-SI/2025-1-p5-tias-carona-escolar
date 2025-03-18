package api

import "github.com/gin-gonic/gin"

type Route interface {
	GetPath() string
	GetMethod() string
	GetHandler() gin.HandlerFunc
}
