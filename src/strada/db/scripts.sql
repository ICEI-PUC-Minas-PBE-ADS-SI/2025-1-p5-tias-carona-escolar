--- V1__init_schema.sql
-- Tabela de usuários (Motoristas e Passageiros)
CREATE TABLE tb_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_role (
    user_id INT REFERENCES tb_users (id) ON DELETE CASCADE,
    role_id INT REFERENCES tb_role (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veículos
CREATE TABLE tb_vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES tb_users (id) ON DELETE CASCADE, -- Referência ao motorista
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    fuel_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de rotas sustentáveis
CREATE TABLE tb_sustainable_routes (
    id SERIAL PRIMARY KEY,
    start_point GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    distance DECIMAL(10, 2) NOT NULL, -- Distância em quilômetros
    estimated_time_ms INT NOT NULL, -- Tempo estimado para a viagem
    co2_emission DECIMAL(10, 2), -- Emissão de CO2 estimada para a rota (em kg)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de corridas
CREATE TABLE tb_rides (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES tb_users (id) ON DELETE CASCADE, -- Referência ao motorista
    vehicle_id INT REFERENCES tb_vehicles (id) ON DELETE SET NULL, -- Referência ao veículo
    start_point GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    distance DECIMAL(10, 2) NOT NULL, -- Distância da corrida
    estimated_time_ms INT NOT NULL,
    co2_emission DECIMAL(10, 2), -- Emissão de CO2
    cost DECIMAL(10, 2), -- Custo da corrida
    sustainable_route_id INT REFERENCES tb_sustainable_routes (id) ON DELETE SET NULL, -- Referência à rota sustentável
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pagamentos
CREATE TABLE tb_payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES tb_users (id) ON DELETE CASCADE, -- Referência ao usuário (passageiro)
    amount DECIMAL(10, 2) NOT NULL, -- Valor pago
    payment_method VARCHAR(50) NOT NULL, -- Método de pagamento (ex: 'credit card', 'paypal')
    status VARCHAR(50) NOT NULL CHECK (
        status IN (
            'pending',
            'completed',
            'failed'
        )
    ), -- Status do pagamento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela intermediária para o relacionamento muitos para muitos entre corridas e pagamentos
CREATE TABLE tb_ride_payments (
    id SERIAL PRIMARY KEY,
    ride_id INT REFERENCES tb_rides (id) ON DELETE CASCADE, -- Referência à corrida
    payment_id INT REFERENCES tb_payments (id) ON DELETE CASCADE, -- Referência ao pagamento
    amount DECIMAL(10, 2), -- Valor pago (em caso de múltiplos passageiros)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela intermediária para o relacionamento muitos para muitos entre usuários (passageiros) e corridas
CREATE TABLE tb_ride_passengers (
    ride_id INT REFERENCES tb_rides (id) ON DELETE CASCADE, -- Referência à corrida
    user_id INT REFERENCES tb_users (id) ON DELETE CASCADE, -- Referência ao usuário (passageiro)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_point GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY (Point, 4326) NOT NULL,
    PRIMARY KEY (ride_id, user_id)
);

CREATE TABLE tb_driver_offers (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES tb_users (id) ON DELETE CASCADE,
    available_seats INT NOT NULL,
    origin GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    destination GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    available_datetime TIMESTAMP NOT NULL,
    ride_datetime TIMESTAMP NOT NULL,
    ride_id INT REFERENCES tb_rides (id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE tb_ride_requests (
    id SERIAL PRIMARY KEY,
    passenger_id INT NOT NULL REFERENCES tb_users (id) ON DELETE CASCADE,
    origin GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    destination GEOGRAPHY (Point, 4326) NOT NULL, -- Alterado para GEOGRAPHY
    ride_datetime TIMESTAMP NOT NULL,
    drive_offer_id INT REFERENCES tb_driver_offers (id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending'
);

--- V2__add_stop_points.sql
ALTER TABLE tb_rides
ADD COLUMN stop_points GEOGRAPHY (MultiPoint, 4326) NOT NULL;

--- V3__remove_null_constraint
ALTER TABLE tb_rides ALTER COLUMN stop_points DROP NOT NULL;

--- V4__drop_unused_tables
-- Remover as constraints de chave estrangeira
ALTER TABLE tb_user_role
DROP CONSTRAINT IF EXISTS tb_user_role_user_id_fkey;

ALTER TABLE tb_vehicles
DROP CONSTRAINT IF EXISTS tb_vehicles_driver_id_fkey;

ALTER TABLE tb_payments
DROP CONSTRAINT IF EXISTS tb_payments_user_id_fkey;

ALTER TABLE tb_ride_passengers
DROP CONSTRAINT IF EXISTS tb_ride_passengers_user_id_fkey;

ALTER TABLE tb_driver_offers
DROP CONSTRAINT IF EXISTS tb_driver_offers_driver_id_fkey;

ALTER TABLE tb_ride_requests
DROP CONSTRAINT IF EXISTS tb_ride_requests_passenger_id_fkey;

-- Alterações na tabela tb_rides
ALTER TABLE tb_rides DROP COLUMN IF EXISTS sustainable_route_id;

ALTER TABLE tb_rides DROP COLUMN IF EXISTS driver_id;

ALTER TABLE tb_rides DROP COLUMN IF EXISTS vehicle_id;

ALTER TABLE tb_rides ADD COLUMN driver_id INT NOT NULL;

ALTER TABLE tb_rides ADD COLUMN vehicle_id INT NOT NULL;

-- Excluir tabelas dependentes
DROP TABLE IF EXISTS tb_user_role CASCADE;

DROP TABLE IF EXISTS tb_payments CASCADE;

DROP TABLE IF EXISTS tb_ride_payments CASCADE;

DROP TABLE IF EXISTS tb_sustainable_routes CASCADE;

DROP TABLE IF EXISTS tb_vehicles CASCADE;

-- Alterações na tabela tb_ride_passengers
ALTER TABLE tb_ride_passengers
ALTER COLUMN user_id
SET
    DATA TYPE INT;

ALTER TABLE tb_ride_passengers ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE tb_ride_passengers
ADD COLUMN role VARCHAR(255) NOT NULL CHECK (
    role IN ('passenger', 'driver')
);

--- V5__drop_unused_tables
DROP TABLE IF EXISTS tb_users;

DROP TABLE IF EXISTS tb_role;

--- V6__change_user_id_type
ALTER TABLE tb_ride_passengers
ALTER COLUMN user_id
SET
    DATA TYPE VARCHAR(255);

ALTER TABLE tb_ride_requests
ALTER COLUMN passenger_id
SET
    DATA TYPE VARCHAR(255);

ALTER TABLE tb_rides
ALTER COLUMN driver_id
SET
    DATA TYPE VARCHAR(255);

ALTER TABLE tb_driver_offers
ALTER COLUMN driver_id
SET
    DATA TYPE VARCHAR(255);

--- V7__add_description_for_destinations
ALTER TABLE tb_rides ADD COLUMN description VARCHAR(255);

ALTER TABLE tb_ride_requests ADD COLUMN description VARCHAR(255);

--- V8__add_img_url
ALTER TABLE tb_rides ADD COLUMN img_url VARCHAR(255);

ALTER TABLE tb_ride_requests ADD COLUMN img_url VARCHAR(255);

--- V9__create_tb_vehicle
CREATE TABLE tb_vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    fuel_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- V10__add_vehicle_to_ride
ALTER TABLE tb_rides
ADD constraint fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES tb_vehicles (id);

CREATE TABLE "User" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text,
  "password" text,
  "imgUrl" text,
  "numberOfFollowers" integer DEFAULT 0,
  "numberOfFollowings" integer NOT NULL DEFAULT 0,
  "username" text,
  "createdAt" timestamp(3) DEFAULT (CURRENT_TIMESTAMP),
  "isActive" boolean DEFAULT true,
  "authProvider" text DEFAULT ('local'::text)
);

CREATE TABLE "RefreshToken" (
    "id" text PRIMARY KEY NOT NULL,
    "token" text NOT NULL,
    "userId" text NOT NULL,
    "email" text NOT NULL,
    "revoked" boolean NOT NULL DEFAULT false
);

CREATE TABLE "PasswordRecovery" (
    "id" text PRIMARY KEY NOT NULL,
    "token" text NOT NULL,
    "userId" text NOT NULL,
    "email" text NOT NULL,
    "expiresAt" bigint NOT NULL,
    "revoked" boolean NOT NULL DEFAULT false
);

db.createCollection("chat", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["roomName", "members"],
      properties: {
        roomName: { bsonType: "string" },
        imgUrl: { bsonType: "string" },
        description: { bsonType: "string" },
        latestMessage: { bsonType: "string" },
        latestActivity: { bsonType: "date" },
        members: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["id", "name", "nickname"],
            properties: {
              id: { bsonType: "string" },
              name: { bsonType: "string" },
              nickname: { bsonType: "string" },
              imgUrl: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

db.createCollection("message", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender", "content", "instant", "status", "chat"],
      properties: {
        sender: {
          bsonType: "object",
          required: ["id", "name", "nickname"],
          properties: {
            id: { bsonType: "string" },
            name: { bsonType: "string" },
            nickname: { bsonType: "string" },
            imgUrl: { bsonType: "string" }
          }
        },
        content: { bsonType: "string" },
        instant: { bsonType: "date" },
        status: { enum: ["RECEIVED", "SENT", "READ"] },
        chat: { bsonType: "objectId" }
      }
    }
  }
});

--- Criação tabela tb_fcm_token
create table tb_fcm_token (
    user_id bigint not null,
    token varchar(255),
    primary key (user_id)
) engine = InnoDB;

--- Criação tabela tb_notification
create table tb_notification (
    created_at datetime(6),
    id bigint not null auto_increment,
    receiver_id bigint,
    sender_id bigint,
    message varchar(255),
    title varchar(255),
    primary key (id)
) engine = InnoDB;

```