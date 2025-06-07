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

// Flag to prevent multiple simultaneous refresh attempts
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

const axiosInstance = axios.create({ timeout: 10000 });

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url?.startsWith("http")) {
      return config;
    }

    let subdomain = "";
    if (config.url?.includes("/auth/") || config.url?.includes("/users/")) {
      subdomain = "auth";
    } else if (config.url?.includes("/rides")) {
      subdomain = "ride";
    }

    const baseUrl = createApiUrl(subdomain);
    config.baseURL = baseUrl;

    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Request URL:", config);

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message));
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
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
          // Create a simple axios instance without interceptors for token refresh
          const refreshInstance = axios.create({
            baseURL: authUrl,
            timeout: 10000,
          });

          const response = await refreshInstance.post("/auth/refresh-token", {
            refresh_token: refreshToken,
          });

          const accessToken = response.data;
          await storeToken(accessToken);

          // Update the authorization header for the original request
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${accessToken.access_token}`;

          processQueue(null, accessToken.access_token);

          return axios(originalRequest);
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
      console.log("Request URL:", config);
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
          // If we're already refreshing, queue this request
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
            // Create a simple axios instance without interceptors for token refresh
            const refreshInstance = axios.create({
              baseURL: authUrl,
              timeout: 10000,
            });

            const response = await refreshInstance.post("/auth/refresh-token", {
              refresh_token: refreshToken,
            });

            const accessToken = response.data;
            await storeToken(accessToken);

            // Update the authorization header for the original request
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

  console.log("Axios instance created for subdomain:", subdomain);
  console.log("Base URL:", baseURL);

  return instance;
};

export const authAxios = createAxiosInstance("auth");
export const rideAxios = createAxiosInstance("ride");
export default axiosInstance;
