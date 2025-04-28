-- name: CreateRide :one
INSERT INTO
    tb_rides (
        driver_id,
        vehicle_id,
        start_point,
        end_point,
        distance,
        estimated_time_ms,
        co2_emission,
        stop_points,
        cost,
        description,
        img_url,
        created_at,
        updated_at
    )
VALUES (
        $1,
        $2,
        ST_SetSRID (ST_MakePoint ($3, $4), 4326),
        ST_SetSRID (ST_MakePoint ($5, $6), 4326),
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        NOW(),
        NOW()
    )
RETURNING
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    ST_AsText (stop_points) AS stop_points,
    cost,
    img_url,
    description,
    created_at,
    updated_at;

-- name: FindRideByID :one
SELECT
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    ST_AsText (stop_points) AS stop_points,
    cost,
    img_url,
    description,
    created_at,
    updated_at
FROM tb_rides
WHERE
    id = $1;

-- name: FindAllRides :many
SELECT
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    ST_AsText (stop_points) AS stop_points,
    cost,
    img_url,
    description,
    created_at,
    updated_at
FROM tb_rides;

-- name: UpdateRide :one
UPDATE tb_rides
SET
    driver_id = $2,
    vehicle_id = $3,
    start_point = ST_SetSRID (ST_MakePoint ($4, $5), 4326),
    end_point = ST_SetSRID (ST_MakePoint ($6, $7), 4326),
    distance = $8,
    estimated_time_ms = $9,
    co2_emission = $10,
    cost = $11,
    stop_points = $12,
    description = $13,
    img_url = $14,
    updated_at = NOW()
WHERE
    id = $1
RETURNING
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    cost,
    img_url,
    ST_AsText (stop_points) AS stop_points,
    description,
    created_at,
    updated_at;

-- name: DeleteRide :exec
DELETE FROM tb_rides WHERE id = $1;

-- name: FindNearRides :many
WITH
    trajeto AS (
        SELECT unnest($1::point []) AS ponto
    )
SELECT
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    cost,
    ST_AsText (stop_points) AS stop_points,
    description,
    img_url,
    created_at,
    updated_at
FROM tb_rides
WHERE
    EXISTS (
        SELECT 1
        FROM trajeto
        WHERE (
                ST_DWithin (
                    ST_SetSRID (
                        ST_MakePoint (
                            trajeto.ponto[0],
                            trajeto.ponto[1]
                        ),
                        4326
                    )::geography,
                    start_point::geography,
                    $2
                )
                OR ST_DWithin (
                    ST_SetSRID (
                        ST_MakePoint (
                            trajeto.ponto[0],
                            trajeto.ponto[1]
                        ),
                        4326
                    )::geography,
                    end_point::geography,
                    $2
                )
            )
    );

SELECT
    id,
    driver_id,
    vehicle_id,
    ST_AsText (start_point) AS start_point,
    ST_AsText (end_point) AS end_point,
    distance,
    estimated_time_ms,
    co2_emission,
    img_url,
    ST_AsText (stop_points) AS stop_points,
    cost,
    created_at,
    updated_at,
    description,
    ST_Distance (
        start_point,
        ST_SetSRID (ST_MakePoint ($1, $2), 4326)
    ) AS distance_start,
    ST_Distance (
        end_point,
        ST_SetSRID (ST_MakePoint ($1, $2), 4326)
    ) AS distance_end
FROM tb_rides
WHERE
    ST_DWithin (
        start_point,
        ST_SetSRID (ST_MakePoint ($1, $2), 4326),
        $3
    )
    OR ST_DWithin (
        end_point,
        ST_SetSRID (ST_MakePoint ($1, $2), 4326),
        $3
    )
    OR EXISTS (
        SELECT 1
        FROM unnest(stop_points) AS sp
        WHERE
            ST_DWithin (
                sp,
                ST_SetSRID (ST_MakePoint ($1, $2), 4326),
                $3
            )
    )
ORDER BY distance_start ASC, distance_end ASC
LIMIT 10;