package config

import (
	"context"
	"log"

	"github.com/244Walyson/shared-ride/configs"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDB() (*pgxpool.Pool, error) {

	dbpool, err := pgxpool.New(context.Background(), getConnectionString())
	if err != nil {
		return nil, err
	}

	err = dbpool.Ping(context.Background())
	if err != nil {
		dbpool.Close()
		return nil, err
	}

	log.Println("Connected to the database successfully!")
	return dbpool, nil
}

func getConnectionString() string {
	return configs.GetEnv("DATABASE_URL", "")
}
