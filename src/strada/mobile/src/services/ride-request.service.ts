import { rideAxios } from "./helpers/interceptors";

export const createRideRequest = async (rideId: string, rideRequest: any) => {
  try {
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
