import * as SecureStore from "expo-secure-store";
import { rideAxios } from "./helpers/interceptors";

interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface CreateRideData {
  startLocation: GeoPoint;
  endLocation: GeoPoint;
  waypoints?: GeoPoint[];
  departureTime: string;
  seats: number;
  allowLuggage?: boolean;
  allowPets?: boolean;
  allowSmoking?: boolean;
  price?: number;
}

interface SearchRideParams {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  limit?: number;
  page?: number;
  sortBy?: 'distance' | 'price' | 'time' | 'rating';
  allowLuggage?: boolean;
  allowPets?: boolean;
  allowSmoking?: boolean;
  maxPrice?: number;
  seats?: number;
  date?: string;
  maxStartDistance?: number;
  maxEndDistance?: number;
}

interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface DynamicPriceRequest {
  startLocation: GeoPoint;
  endLocation: GeoPoint;
  waypoints?: GeoPoint[];
  departureTime: string;
  seats: number;
}

export const createRide = async (rideData: CreateRideData) => {
  try {
    const response = await rideAxios.post(`/rides`, rideData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchRides = async (params: SearchRideParams) => {
  try {
    const response = await rideAxios.get(`/rides/search`, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchByRouteSimilarity = async (
  routePoints: GeoPoint[],
  maxRouteDistance: number,
  minSimilarity: number,
  date?: string,
  seats?: number
) => {
  try {
    const params = {
      maxRouteDistance,
      minSimilarity,
      ...(date && { date }),
      ...(seats && { seats })
    };

    const response = await rideAxios.post(`/rides/search/route-similarity`, routePoints, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRideById = async (id: string) => {
  try {
    const response = await rideAxios.get(`/rides/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRideStatus = async (id: string, status: string) => {
  try {
    const response = await rideAxios.put(`/rides/${id}/status`, status);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRideLocation = async (id: string, location: GeoPoint) => {
  try {
    const response = await rideAxios.put(`/rides/${id}/location`, location);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPopularRoutes = async (
  startLat: number,
  startLng: number,
  radius?: number,
  limit?: number
) => {
  try {
    const params = {
      startLat,
      startLng,
      ...(radius && { radius }),
      ...(limit && { limit })
    };

    const response = await rideAxios.get(`/rides/popular-routes`, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRideDensityHeatmap = async (
  boundingBox: BoundingBox,
  gridSize?: number,
  dateFrom?: string,
  dateTo?: string
) => {
  try {
    const params = {
      ...(gridSize && { gridSize }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    };

    const response = await rideAxios.post(`/rides/heatmap`, boundingBox, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const calculateDynamicPrice = async (priceRequest: DynamicPriceRequest) => {
  try {
    const response = await rideAxios.post(`/rides/dynamic-price`, priceRequest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getRideHistory = async (userId: string, filters: any) => {
  try {
    console.log(`/rides/history/${userId}?${new URLSearchParams(filters)}`)
    const response = await rideAxios.get(`/rides/history/${userId}?${new URLSearchParams(filters)}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const storeRideID = async (id: string) => {
  await SecureStore.setItemAsync("rideID", id);
};

export const getStoredRideID = async () => {
  return await SecureStore.getItemAsync("rideID");
};

export const storeRide = async (ride: Partial<CreateRideData>) => {
  await SecureStore.setItemAsync("ride", JSON.stringify(ride));
};

export const getStoredRide = async () => {
  return await SecureStore.getItemAsync("ride");
};

export const removeStoredRideID = async () => {
  await SecureStore.deleteItemAsync("rideID");
};

export const removeStoredRide = async () => {
  await SecureStore.deleteItemAsync("ride");
};