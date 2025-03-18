package config

import (
	"context"
	"fmt"
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

	Host := configs.GetEnv("DB_HOST", "localhost")
	Port := configs.GetEnvAsInt("DB_PORT", 5432)
	User := configs.GetEnv("DB_USER", "")
	Password := configs.GetEnv("DB_PASSWORD", "")
	DBName := configs.GetEnv("DB_NAME", "")
	SSLMode := configs.GetEnv("DB_SSLMODE", "disable")

	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		User, Password, Host, Port, DBName, SSLMode)
}
