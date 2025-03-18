WebSocket API Documentation

Base URL: http://rideeeee.com/api/

## `/users`
### Create User
create a new user.
```json
{
    "name": "user",
    "username": "name",
    "email": "email@example.com",
    "password": "123321"
}
```
## `/ws`
### Create New Ride Request
Create a new ride request with passenger details, origin, destination, and time.

```json
{
    "command": "create_ride_request",
    "payload": {
        "passengerId": 1,
        "origin": {
            "latitude": 19.9691633,
            "longitude": -44.1981155
        },
        "destination": {
            "latitude": 19.9691633,
            "longitude": -44.1981155
        },
        "rideDatetime": "2025-02-28T15:00:00Z"
    }
}
```

### Update a Ride Request
Update an existing ride request with new details.

```json
{
    "command": "update_ride_request",
    "payload": {
        "id": 121
        "passengerId": 1,
        "origin": {
            "latitude": 19.9691633,
            "longitude": -44.1981155
        },
        "destination": {
            "latitude": 19.9691633,
            "longitude": -44.1981155
        },
        "rideDatetime": "2025-02-28T15:00:00Z"
    }
}
```

### Delete a Ride Request
Delete a ride request based on its ID.

```json
{
    "command": "delete_ride_request",
    "payload": {
        "id": 1234
    }
}
```

### Create a Ride
Create a new ride with driver, vehicle, and route details.

```json
{
    "command": "create_ride",
    "payload": {
        "driverId": 5678,
        "vehicleId": 91011,
        "startPoint": {
            "latitude": 40.7128,
            "longitude": -74.0060
        },
        "endPoint": {
            "latitude": 34.0522,
            "longitude": -118.2437
        },
        "distance": 5000,
        "estimatedTimeMs": 1500000,
        "co2Emission": 120,
        "cost": 25,
        "sustainableRouteId": 1,
        "createdAt": "2025-02-27T10:00:00Z",
        "updatedAt": "2025-02-27T12:00:00Z"
    }
}
```

### Receive New Ride or Ride Request Notification
When a new ride or ride request is published near the user, the user subscribed to the specified channel will receive a message with the ride details.

```json
{
    "command": "find_near_rides",
    "payload": {
        "id": 1234,
        "driverId": 5678,
        "vehicleId": 91011,
        "startPoint": {
            "latitude": 40.7128,
            "longitude": -74.0060
        },
        "endPoint": {
            "latitude": 34.0522,
            "longitude": -118.2437
        },
        "distance": 5000,
        "estimatedTimeMs": 1500000,
        "co2Emission": 120,
        "cost": 25,
        "sustainableRouteId": 1,
        "createdAt": "2025-02-27T10:00:00Z",
        "updatedAt": "2025-02-27T12:00:00Z"
    }
}
```

