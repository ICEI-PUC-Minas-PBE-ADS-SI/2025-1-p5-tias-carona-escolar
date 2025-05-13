package api

import (
	"strings"
	"time"

	"github.com/244Walyson/shared-ride/configs/logger"
	"github.com/244Walyson/shared-ride/configs/rest_err"
	"github.com/244Walyson/shared-ride/internal/application/ports/in"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type AuthMiddleware struct {
	service in.VerifyTokenService
}

func NewAuthMiddleware(s in.VerifyTokenService) *AuthMiddleware {
	return &AuthMiddleware{
		service: s,
	}
}

func (a *AuthMiddleware) AuthMiddlewareHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		authorization := c.GetHeader("Authorization")

		if authorization == "" {
			logger.Error("Missing Authorization header", nil)
			c.JSON(401, rest_err.NewUnauthorizedRequestError("Authorization header is required"))
			c.Abort()
			return
		}

		parts := strings.Split(authorization, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Error("Missing Bearer prefix", nil)
			c.JSON(401, rest_err.NewUnauthorizedRequestError("Invalid credentials"))
			c.Abort()
			return
		}

		user, err := a.service.VerifyToken(ctx, parts[1])
		if err != nil {
			logger.Error("Invalid token", err)
			c.JSON(401, rest_err.NewUnauthorizedRequestError("Invalid credentials"))
			c.Abort()
			return
		}

		c.Set("user", user)

		c.Next()
	}
}

func LoggingMiddlewareHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		logger.Info("Requisição iniciada", zap.String("method", c.Request.Method), zap.String("path", c.Request.URL.Path))

		c.Next()

		duration := time.Since(start)

		logger.Info("Requisição concluída",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("duration", duration),
		)
	}
}
