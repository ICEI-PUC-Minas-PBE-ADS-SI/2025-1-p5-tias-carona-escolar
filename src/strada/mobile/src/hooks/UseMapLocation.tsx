import { useState, useEffect } from "react";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";

export function useMapLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setHasLocationPermission(true);
    }

    getCurrentLocation();
  }, []);

  const decodeRoute = (encodedPolyline) => {
    const decodedPolyline = polyline.decode(encodedPolyline);
    // Convert from [lat, lng] to [lng, lat]
    const formattedRoute = decodedPolyline.map(([lat, lng]) => [lng, lat]);
    setRouteCoords(formattedRoute);
    return formattedRoute;
  };

  const calculateBoundingBox = (points) => {
    if (points && points.length >= 2) {
      const padding = 0.01;
      const lngs = points.map((coord) => coord[0]);
      const lats = points.map((coord) => coord[1]);

      return {
        ne: [Math.max(...lngs) + padding, Math.max(...lats) + padding],
        sw: [Math.min(...lngs) - padding, Math.min(...lats) - padding],
      };
    }
    return undefined;
  };

  return {
    location,
    errorMsg,
    hasLocationPermission,
    routeCoords,
    decodeRoute,
    calculateBoundingBox,
  };
}
