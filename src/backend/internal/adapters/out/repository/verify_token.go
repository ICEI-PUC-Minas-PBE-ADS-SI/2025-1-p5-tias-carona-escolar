package repository

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/244Walyson/shared-ride/configs"
	"github.com/244Walyson/shared-ride/configs/logger"
	models "github.com/244Walyson/shared-ride/internal/application/core/domain"
	"github.com/244Walyson/shared-ride/internal/application/ports/out"
	"github.com/MicahParks/keyfunc"
	"github.com/golang-jwt/jwt/v4"
)

type VerifyTokenRepository struct {
	jwks *keyfunc.JWKS
}

func NewVerifyTokenRepository() out.VerifyTokenRepository {
	jwkSet, _ := initializeJwks()
	return &VerifyTokenRepository{
		jwks: jwkSet,
	}
}

func initializeJwks() (*keyfunc.JWKS, error) {
	url := configs.GetEnv("JWKS_URL", "http://localhost:3000/auth/.well-known/jwks.json")

	jwks, err := keyfunc.Get(url, keyfunc.Options{
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
		RefreshInterval: time.Minute * 5,
		RefreshErrorHandler: func(err error) {
			fmt.Printf("error updating JWKS: %v\n", err)
		},
	})

	if err != nil {
		logger.Error("error fetching JWKS: %v", err)
		return nil, err
	}

	return jwks, nil
}

func (r *VerifyTokenRepository) ensureJWKS() error {
	if r.jwks == nil {
		logger.Error("JWKS is not initialized, retrying...", nil)
		var err error
		r.jwks, err = initializeJwks()

		maxRetries := 3
		retries := 1

		for r.jwks == nil && retries < maxRetries {
			logger.Error(fmt.Sprintf("Attempt %d to initialize JWKS failed, retrying...", retries), nil)
			time.Sleep(2 * time.Second)
			r.jwks, err = initializeJwks()
			retries++
		}

		if r.jwks == nil {
			logger.Error("Failed to initialize JWKS after 3 attempts", err)
			return errors.New("JWKS is not initialized after multiple attempts")
		}
	}
	return nil
}

func (r *VerifyTokenRepository) VerifyToken(ctx context.Context, tokenString string) (*models.User, error) {

	if err := r.ensureJWKS(); err != nil {
		return nil, err
	}

	token, err := jwt.Parse(tokenString, r.jwks.Keyfunc)
	if err != nil {
		return nil, fmt.Errorf("error validating token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("could not extract claims from token")
	}

	user := &models.User{
		ID:    claims["sub"].(string),
		Email: claims["email"].(string),
	}

	return user, nil
}
