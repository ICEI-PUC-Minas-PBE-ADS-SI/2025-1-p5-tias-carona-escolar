import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { storeToken, removeTokens } from "../token.service";

const BASE_DOMAIN = process.env.EXPO_PUBLIC_BASE_DOMAIN ?? "localhost:3000";
const USE_HTTPS = process.env.EXPO_PUBLIC_USE_HTTPS === "true";

const createApiUrl = (subdomain = "") => {
  if (BASE_DOMAIN.includes("localhost")) {
    return `http://${BASE_DOMAIN}`;
  }
  const protocol = USE_HTTPS ? "https" : "http";
  if (subdomain) {
    return `${protocol}://${subdomain}.${BASE_DOMAIN}`;
  }
  return `${protocol}://${BASE_DOMAIN}`;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const createAxiosInstance = (subdomain = "") => {
  const baseURL = createApiUrl(subdomain);
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(new Error(error.message))
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (refreshToken) {
          try {
            const authUrl = createApiUrl("auth");
            const refreshInstance = axios.create({
              baseURL: authUrl,
              timeout: 10000,
            });

            const response = await refreshInstance.post("/auth/refresh-token", {
              refresh_token: refreshToken,
            });

            const accessToken = response.data;
            await storeToken(accessToken);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${accessToken.access_token}`;

            processQueue(null, accessToken.access_token);

            return instance(originalRequest);
          } catch (refreshError) {
            console.error("Erro ao tentar atualizar o token:", refreshError);
            processQueue(refreshError, null);
            await removeTokens();
          } finally {
            isRefreshing = false;
          }
        } else {
          await removeTokens();
          isRefreshing = false;
        }
      }


      return Promise.reject(new Error(error.message));
    }
  );

  return instance;
};

export const authAxios = createAxiosInstance("auth");
export const rideAxios = createAxiosInstance("ride");
