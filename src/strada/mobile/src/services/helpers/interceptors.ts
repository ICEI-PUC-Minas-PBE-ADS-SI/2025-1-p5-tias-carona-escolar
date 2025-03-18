import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { storeToken, removeTokens } from "../token.service";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("config", config);
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message));
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });

          const accessToken = response.data;

          await storeToken(accessToken);

          error.config.headers[
            "Authorization"
          ] = `Bearer ${accessToken.access_token}`;

          return axios(error.config);
        } catch (refreshError) {
          console.error("Erro ao tentar atualizar o token:", refreshError);
        }
      }
      await removeTokens();
    }

    return Promise.reject(new Error(error.message));
  }
);

export default axiosInstance;