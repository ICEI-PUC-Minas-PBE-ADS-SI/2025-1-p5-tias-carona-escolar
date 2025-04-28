-- name: FindRideRequestByID :one
SELECT
    id,
    passenger_id,
    ST_AsText(origin) AS origin,
    ST_AsText(destination) AS destination,
    ride_datetime,
    drive_offer_id,
    status,
    img_url,
    description
 FROM tb_ride_requests WHERE id = $1;

-- name: FindRideRequestByPassengerID :many
SELECT * FROM tb_ride_requests WHERE passenger_id = $1;

-- name: CreateRideRequest :one
INSERT INTO
    tb_ride_requests (
        passenger_id,
        origin,
        destination,
        ride_datetime,
        description,
        img_url
    )
VALUES (
        $1,
        ST_SetSRID (ST_MakePoint ($2, $3), 4326),
        ST_SetSRID (ST_MakePoint ($4, $5), 4326),
        $6,
        $7,
        $8
    )
RETURNING
    id,
    passenger_id,
    ST_AsText (origin) AS origin,
    ST_AsText (destination) AS destination,
    ride_datetime,
    drive_offer_id,
    description,
    img_url,
    status;

-- name: UpdateRideRequestStatus :one
UPDATE tb_ride_requests SET status = $2 WHERE id = $1 RETURNING *;

-- name: DeleteRideRequest :one
DELETE FROM tb_ride_requests WHERE id = $1 RETURNING *;

-- name: FindNearRideRequests :many
WITH trajeto AS (
    SELECT unnest($1::point[]) as ponto
)
SELECT
    rr.id,
    rr.passenger_id,
    ST_AsText(rr.origin) AS origin,
    ST_AsText(rr.destination) AS destination,
    rr.ride_datetime,
    rr.drive_offer_id,
    rr.status,
    rr.img_url,
    description
FROM tb_ride_requests rr
WHERE EXISTS (
    SELECT 1
    FROM trajeto
    WHERE
        (
            ST_DWithin(
                ST_SetSRID(ST_MakePoint(trajeto.ponto[0], trajeto.ponto[1]), 4326)::geography,
                rr.origin::geography,
                $2
            )
        OR
            ST_DWithin(
                ST_SetSRID(ST_MakePoint(trajeto.ponto[0], trajeto.ponto[1]), 4326)::geography,
                rr.destination::geography,
                $2
            )
        )
);

-- name: UpdateRideRequest :one
UPDATE tb_ride_requests
SET
    passenger_id = $2,
    origin = ST_SetSRID(ST_MakePoint($3, $4), 4326),
    destination = ST_SetSRID(ST_MakePoint($5, $6), 4326),
    ride_datetime = $7,
    drive_offer_id = $8,
    status = $9,
    description = $10,
    img_url = $11
WHERE id = $1
RETURNING
    id,
    passenger_id,
    ST_AsText(origin) AS origin,
    ST_AsText(destination) AS destination,
    ride_datetime,
    drive_offer_id,
    description,
    img_url,
    status;


-- name: FindAllRideRequests :many
SELECT
    id,
    passenger_id,
    ST_AsText(origin) AS origin,
    ST_AsText(destination) AS destination,
    ride_datetime,
    drive_offer_id,
    img_url,
    status,
    description
FROM tb_ride_requests;