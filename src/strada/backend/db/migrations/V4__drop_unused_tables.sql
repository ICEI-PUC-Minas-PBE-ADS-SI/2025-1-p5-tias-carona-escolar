-- Remover as constraints de chave estrangeira
ALTER TABLE tb_user_role DROP CONSTRAINT IF EXISTS tb_user_role_user_id_fkey;
ALTER TABLE tb_vehicles DROP CONSTRAINT IF EXISTS tb_vehicles_driver_id_fkey;
ALTER TABLE tb_payments DROP CONSTRAINT IF EXISTS tb_payments_user_id_fkey;
ALTER TABLE tb_ride_passengers DROP CONSTRAINT IF EXISTS tb_ride_passengers_user_id_fkey;
ALTER TABLE tb_driver_offers DROP CONSTRAINT IF EXISTS tb_driver_offers_driver_id_fkey;
ALTER TABLE tb_ride_requests DROP CONSTRAINT IF EXISTS tb_ride_requests_passenger_id_fkey;

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
ALTER TABLE tb_ride_passengers ALTER COLUMN user_id SET DATA TYPE INT;
ALTER TABLE tb_ride_passengers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE tb_ride_passengers ADD COLUMN role VARCHAR(255) NOT NULL CHECK(role IN ('passenger', 'driver'));
