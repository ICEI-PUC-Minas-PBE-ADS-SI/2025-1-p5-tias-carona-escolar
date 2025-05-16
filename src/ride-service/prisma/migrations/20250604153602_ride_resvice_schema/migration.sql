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
    "driverId" TEXT NOT NULL,
    "startPoint" geometry(Point, 4326) NOT NULL,
    "endPoint" geometry(Point, 4326) NOT NULL,
    "startAddress" TEXT NOT NULL,
    "endAddress" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "pricePerSeat" DOUBLE PRECISION NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'PENDING',
    "vehicleModel" TEXT NOT NULL,
    "vehicleColor" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "allowLuggage" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDuration" INTEGER NOT NULL,
    "estimatedDistance" DOUBLE PRECISION NOT NULL,
    "actualDuration" INTEGER,
    "actualDistance" DOUBLE PRECISION,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "plannedRoute" geometry(LineString, 4326),
    "actualRoute" geometry(LineString, 4326),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentLatitude" DOUBLE PRECISION,
    "currentLongitude" DOUBLE PRECISION,
    "currentLocation" geometry(Point, 4326),
    "lastLocationUpdate" TIMESTAMP(3),

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_points" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "point" geometry(Point, 4326) NOT NULL,
    "order" INTEGER NOT NULL,
    "address" TEXT,
    "isPickup" BOOLEAN NOT NULL DEFAULT false,
    "isDropoff" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "route_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actual_path_points" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "rideId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seatsBooked" INTEGER NOT NULL DEFAULT 1,
    "totalPaid" DOUBLE PRECISION NOT NULL,
    "status" "PassengerStatus" NOT NULL DEFAULT 'CONFIRMED',
    "pickupPoint" geometry(Point, 4326),
    "dropoffPoint" geometry(Point, 4326),
    "pickupAddress" TEXT,
    "dropoffAddress" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickedUpAt" TIMESTAMP(3),
    "droppedOffAt" TIMESTAMP(3),

    CONSTRAINT "ride_passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_requests" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seatsNeeded" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedPickupPoint" geometry(Point, 4326),
    "requestedDropoffPoint" geometry(Point, 4326),
    "requestedPickupAddress" TEXT,
    "requestedDropoffAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "droppedOffAt" TIMESTAMP(3),

    CONSTRAINT "ride_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "ratedId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "type" "RatingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "gatewayResponse" JSONB,
    "failureReason" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "refundReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_search_index" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "boundingBox" geometry(Polygon, 4326) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "pricePerSeat" DOUBLE PRECISION NOT NULL,
    "allowSmoking" BOOLEAN NOT NULL,
    "allowPets" BOOLEAN NOT NULL,
    "allowLuggage" BOOLEAN NOT NULL,
    "driverRating" DOUBLE PRECISION,
    "driverTotalRides" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popular_routes" (
    "id" TEXT NOT NULL,
    "startPoint" geometry(Point, 4326) NOT NULL,
    "endPoint" geometry(Point, 4326) NOT NULL,
    "route" geometry(LineString, 4326) NOT NULL,
    "startAddress" TEXT NOT NULL,
    "endAddress" TEXT NOT NULL,
    "rideCount" INTEGER NOT NULL DEFAULT 1,
    "avgPrice" DOUBLE PRECISION NOT NULL,
    "avgDuration" INTEGER NOT NULL,
    "avgDistance" DOUBLE PRECISION NOT NULL,
    "lastRideDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popular_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rides_startPoint_idx" ON "rides" USING GIST ("startPoint");

-- CreateIndex
CREATE INDEX "rides_endPoint_idx" ON "rides" USING GIST ("endPoint");

-- CreateIndex
CREATE INDEX "rides_plannedRoute_idx" ON "rides" USING GIST ("plannedRoute");

-- CreateIndex
CREATE INDEX "rides_departureTime_idx" ON "rides"("departureTime");

-- CreateIndex
CREATE INDEX "rides_status_idx" ON "rides"("status");

-- CreateIndex
CREATE INDEX "rides_driverId_idx" ON "rides"("driverId");

-- CreateIndex
CREATE INDEX "route_points_point_idx" ON "route_points" USING GIST ("point");

-- CreateIndex
CREATE INDEX "route_points_rideId_order_idx" ON "route_points"("rideId", "order");

-- CreateIndex
CREATE INDEX "actual_path_points_point_idx" ON "actual_path_points" USING GIST ("point");

-- CreateIndex
CREATE INDEX "actual_path_points_rideId_timestamp_idx" ON "actual_path_points"("rideId", "timestamp");

-- CreateIndex
CREATE INDEX "actual_path_points_rideId_order_idx" ON "actual_path_points"("rideId", "order");

-- CreateIndex
CREATE INDEX "ride_passengers_pickupPoint_idx" ON "ride_passengers" USING GIST ("pickupPoint");

-- CreateIndex
CREATE INDEX "ride_passengers_dropoffPoint_idx" ON "ride_passengers" USING GIST ("dropoffPoint");

-- CreateIndex
CREATE UNIQUE INDEX "ride_passengers_rideId_passengerId_key" ON "ride_passengers"("rideId", "passengerId");

-- CreateIndex
CREATE INDEX "ride_requests_requestedPickupPoint_idx" ON "ride_requests" USING GIST ("requestedPickupPoint");

-- CreateIndex
CREATE INDEX "ride_requests_requestedDropoffPoint_idx" ON "ride_requests" USING GIST ("requestedDropoffPoint");

-- CreateIndex
CREATE UNIQUE INDEX "ride_requests_rideId_passengerId_key" ON "ride_requests"("rideId", "passengerId");

-- CreateIndex
CREATE INDEX "ratings_ratedId_idx" ON "ratings"("ratedId");

-- CreateIndex
CREATE INDEX "ratings_raterId_idx" ON "ratings"("raterId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_rideId_raterId_ratedId_key" ON "ratings"("rideId", "raterId", "ratedId");

-- CreateIndex
CREATE INDEX "payments_passengerId_idx" ON "payments"("passengerId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ride_search_index_rideId_key" ON "ride_search_index"("rideId");

-- CreateIndex
CREATE INDEX "ride_search_index_boundingBox_idx" ON "ride_search_index" USING GIST ("boundingBox");

-- CreateIndex
CREATE INDEX "ride_search_index_departureDate_availableSeats_idx" ON "ride_search_index"("departureDate", "availableSeats");

-- CreateIndex
CREATE INDEX "ride_search_index_pricePerSeat_idx" ON "ride_search_index"("pricePerSeat");

-- CreateIndex
CREATE INDEX "popular_routes_startPoint_idx" ON "popular_routes" USING GIST ("startPoint");

-- CreateIndex
CREATE INDEX "popular_routes_endPoint_idx" ON "popular_routes" USING GIST ("endPoint");

-- CreateIndex
CREATE INDEX "popular_routes_rideCount_idx" ON "popular_routes"("rideCount");

-- AddForeignKey
ALTER TABLE "route_points" ADD CONSTRAINT "route_points_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actual_path_points" ADD CONSTRAINT "actual_path_points_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_passengers" ADD CONSTRAINT "ride_passengers_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
