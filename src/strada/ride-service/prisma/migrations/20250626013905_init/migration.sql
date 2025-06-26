-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PassengerStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'NO_SHOW', 'PICKED_UP', 'DROPPED_OFF');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ON_GOING', 'COMPLETED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('DRIVER_TO_PASSENGER', 'PASSENGER_TO_DRIVER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'E_WALLET', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "start_point" geometry(Point, 4326) NOT NULL,
    "end_point" geometry(Point, 4326) NOT NULL,
    "start_address" TEXT NOT NULL,
    "end_address" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "price_per_seat" DOUBLE PRECISION NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'PENDING',
    "vehicle_model" TEXT NOT NULL,
    "vehicle_color" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "allow_luggage" BOOLEAN NOT NULL DEFAULT false,
    "estimated_duration" INTEGER NOT NULL,
    "estimated_distance" DOUBLE PRECISION NOT NULL,
    "actual_duration" INTEGER,
    "actual_distance" DOUBLE PRECISION,
    "actual_start_time" TIMESTAMP(3),
    "actual_end_time" TIMESTAMP(3),
    "planned_route" geometry(LineString, 4326),
    "actual_route" geometry(LineString, 4326),
    "bounding_box" geometry(Polygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_latitude" DOUBLE PRECISION,
    "current_longitude" DOUBLE PRECISION,
    "current_location" geometry(Point, 4326),
    "last_location_update" TIMESTAMP(3),

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_points" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "point" geometry(Point, 4326) NOT NULL,
    "order" INTEGER NOT NULL,
    "address" TEXT,
    "is_pickup" BOOLEAN NOT NULL DEFAULT false,
    "is_dropoff" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "route_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actual_path_points" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "point" geometry(Point, 4326) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,

    CONSTRAINT "actual_path_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_passengers" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "seats_booked" INTEGER NOT NULL DEFAULT 1,
    "total_paid" DOUBLE PRECISION NOT NULL,
    "status" "PassengerStatus" NOT NULL DEFAULT 'CONFIRMED',
    "pickup_point" geometry(Point, 4326),
    "dropoff_point" geometry(Point, 4326),
    "pickup_address" TEXT,
    "dropoff_address" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "picked_up_at" TIMESTAMP(3),
    "dropped_off_at" TIMESTAMP(3),

    CONSTRAINT "ride_passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_requests" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "seats_needed" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requested_pickup_point" geometry(Point, 4326),
    "requested_dropoff_point" geometry(Point, 4326),
    "requested_pickup_address" TEXT,
    "requested_dropoff_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "responded_at" TIMESTAMP(3),
    "pickup_distance" DOUBLE PRECISION,
    "dropoff_distance" DOUBLE PRECISION,
    "additional_distance" DOUBLE PRECISION,
    "detour_percentage" DOUBLE PRECISION,
    "picked_up_at" TIMESTAMP(3),
    "dropped_off_at" TIMESTAMP(3),

    CONSTRAINT "ride_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "rater_id" TEXT NOT NULL,
    "rated_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "type" "RatingType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_id" TEXT,
    "gateway_response" JSONB,
    "failure_reason" TEXT,
    "refund_amount" DOUBLE PRECISION,
    "refund_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_search_index" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "bounding_box" geometry(Polygon, 4326) NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "price_per_seat" DOUBLE PRECISION NOT NULL,
    "allow_smoking" BOOLEAN NOT NULL,
    "allow_pets" BOOLEAN NOT NULL,
    "allow_luggage" BOOLEAN NOT NULL,
    "driver_rating" DOUBLE PRECISION,
    "driver_total_rides" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popular_routes" (
    "id" TEXT NOT NULL,
    "start_point" geometry(Point, 4326) NOT NULL,
    "end_point" geometry(Point, 4326) NOT NULL,
    "route" geometry(LineString, 4326) NOT NULL,
    "start_address" TEXT NOT NULL,
    "end_address" TEXT NOT NULL,
    "ride_count" INTEGER NOT NULL DEFAULT 1,
    "avg_price" DOUBLE PRECISION NOT NULL,
    "avg_duration" INTEGER NOT NULL,
    "avg_distance" DOUBLE PRECISION NOT NULL,
    "last_ride_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popular_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rides_start_point_idx" ON "rides" USING GIST ("start_point");

-- CreateIndex
CREATE INDEX "rides_end_point_idx" ON "rides" USING GIST ("end_point");

-- CreateIndex
CREATE INDEX "rides_planned_route_idx" ON "rides" USING GIST ("planned_route");

-- CreateIndex
CREATE INDEX "rides_departure_time_idx" ON "rides"("departure_time");

-- CreateIndex
CREATE INDEX "rides_status_idx" ON "rides"("status");

-- CreateIndex
CREATE INDEX "rides_driver_id_idx" ON "rides"("driver_id");

-- CreateIndex
CREATE INDEX "route_points_point_idx" ON "route_points" USING GIST ("point");

-- CreateIndex
CREATE INDEX "route_points_ride_id_order_idx" ON "route_points"("ride_id", "order");

-- CreateIndex
CREATE INDEX "actual_path_points_point_idx" ON "actual_path_points" USING GIST ("point");

-- CreateIndex
CREATE INDEX "actual_path_points_ride_id_timestamp_idx" ON "actual_path_points"("ride_id", "timestamp");

-- CreateIndex
CREATE INDEX "actual_path_points_ride_id_order_idx" ON "actual_path_points"("ride_id", "order");

-- CreateIndex
CREATE INDEX "ride_passengers_pickup_point_idx" ON "ride_passengers" USING GIST ("pickup_point");

-- CreateIndex
CREATE INDEX "ride_passengers_dropoff_point_idx" ON "ride_passengers" USING GIST ("dropoff_point");

-- CreateIndex
CREATE UNIQUE INDEX "ride_passengers_ride_id_passenger_id_key" ON "ride_passengers"("ride_id", "passenger_id");

-- CreateIndex
CREATE INDEX "ride_requests_requested_pickup_point_idx" ON "ride_requests" USING GIST ("requested_pickup_point");

-- CreateIndex
CREATE INDEX "ride_requests_requested_dropoff_point_idx" ON "ride_requests" USING GIST ("requested_dropoff_point");

-- CreateIndex
CREATE UNIQUE INDEX "ride_requests_ride_id_passenger_id_key" ON "ride_requests"("ride_id", "passenger_id");

-- CreateIndex
CREATE INDEX "ratings_rated_id_idx" ON "ratings"("rated_id");

-- CreateIndex
CREATE INDEX "ratings_rater_id_idx" ON "ratings"("rater_id");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_ride_id_rater_id_rated_id_key" ON "ratings"("ride_id", "rater_id", "rated_id");

-- CreateIndex
CREATE INDEX "payments_passenger_id_idx" ON "payments"("passenger_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ride_search_index_ride_id_key" ON "ride_search_index"("ride_id");

-- CreateIndex
CREATE INDEX "ride_search_index_bounding_box_idx" ON "ride_search_index" USING GIST ("bounding_box");

-- CreateIndex
CREATE INDEX "ride_search_index_departure_date_available_seats_idx" ON "ride_search_index"("departure_date", "available_seats");

-- CreateIndex
CREATE INDEX "ride_search_index_price_per_seat_idx" ON "ride_search_index"("price_per_seat");

-- CreateIndex
CREATE INDEX "popular_routes_start_point_idx" ON "popular_routes" USING GIST ("start_point");

-- CreateIndex
CREATE INDEX "popular_routes_end_point_idx" ON "popular_routes" USING GIST ("end_point");

-- CreateIndex
CREATE INDEX "popular_routes_ride_count_idx" ON "popular_routes"("ride_count");

-- AddForeignKey
ALTER TABLE "route_points" ADD CONSTRAINT "route_points_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actual_path_points" ADD CONSTRAINT "actual_path_points_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_passengers" ADD CONSTRAINT "ride_passengers_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
