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
    user_id INT REFERENCES tb_users(id) ON DELETE CASCADE,
    role_id INT REFERENCES tb_role(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veículos
CREATE TABLE tb_vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES tb_users(id) ON DELETE CASCADE,  -- Referência ao motorista
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
    start_point GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    distance DECIMAL(10,2) NOT NULL,  -- Distância em quilômetros
    estimated_time_ms INT NOT NULL,  -- Tempo estimado para a viagem
    co2_emission DECIMAL(10,2),  -- Emissão de CO2 estimada para a rota (em kg)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de corridas
CREATE TABLE tb_rides (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES tb_users(id) ON DELETE CASCADE,  -- Referência ao motorista
    vehicle_id INT REFERENCES tb_vehicles(id) ON DELETE SET NULL,  -- Referência ao veículo
    start_point GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    distance DECIMAL(10,2) NOT NULL,  -- Distância da corrida
    estimated_time_ms INT NOT NULL,
    co2_emission DECIMAL(10,2),  -- Emissão de CO2
    cost DECIMAL(10,2),  -- Custo da corrida
    sustainable_route_id INT REFERENCES tb_sustainable_routes(id) ON DELETE SET NULL,  -- Referência à rota sustentável
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pagamentos
CREATE TABLE tb_payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES tb_users(id) ON DELETE CASCADE,  -- Referência ao usuário (passageiro)
    amount DECIMAL(10,2) NOT NULL,  -- Valor pago
    payment_method VARCHAR(50) NOT NULL,  -- Método de pagamento (ex: 'credit card', 'paypal')
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),  -- Status do pagamento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela intermediária para o relacionamento muitos para muitos entre corridas e pagamentos
CREATE TABLE tb_ride_payments (
    id SERIAL PRIMARY KEY,
    ride_id INT REFERENCES tb_rides(id) ON DELETE CASCADE,  -- Referência à corrida
    payment_id INT REFERENCES tb_payments(id) ON DELETE CASCADE,  -- Referência ao pagamento
    amount DECIMAL(10,2),  -- Valor pago (em caso de múltiplos passageiros)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela intermediária para o relacionamento muitos para muitos entre usuários (passageiros) e corridas
CREATE TABLE tb_ride_passengers (
    ride_id INT REFERENCES tb_rides(id) ON DELETE CASCADE,  -- Referência à corrida
    user_id INT REFERENCES tb_users(id) ON DELETE CASCADE,  -- Referência ao usuário (passageiro)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_point GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    end_point GEOGRAPHY(Point, 4326) NOT NULL,
    PRIMARY KEY (ride_id, user_id)
);

CREATE TABLE tb_driver_offers (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES tb_users(id) ON DELETE CASCADE,
    available_seats INT NOT NULL,
    origin GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    destination GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    available_datetime TIMESTAMP NOT NULL,
    ride_datetime TIMESTAMP NOT NULL,
    ride_id INT REFERENCES tb_rides(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE tb_ride_requests (
    id SERIAL PRIMARY KEY,
    passenger_id INT NOT NULL REFERENCES tb_users(id) ON DELETE CASCADE,
    origin GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    destination GEOGRAPHY(Point, 4326) NOT NULL,  -- Alterado para GEOGRAPHY
    ride_datetime TIMESTAMP NOT NULL,
    drive_offer_id INT REFERENCES tb_driver_offers(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending'
);
