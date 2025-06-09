import { rideAxios } from "./helpers/interceptors";

export const createRideRequest = async (rideId: string, rideRequest: any) => {
  try {
    console.log("Creating ride request:", rideRequest);
    const response = await rideAxios.post(
      `/rides/${rideId}/requests`,
      rideRequest
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const acceptRideRequest = async (
  rideRequestId: string,
) => {
  try {
    const response = await rideAxios.put(
      `/rides/requests/${rideRequestId}/accept`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
