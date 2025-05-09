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

const axiosInstance = axios.create({ timeout: 10000 });
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url?.startsWith('http')) {
      return config;
    }

    let subdomain = '';
    if (config.url?.includes('/auth/')) {
      subdomain = 'auth';
    } else if (config.url?.includes('/rides')) {
      subdomain = 'ride';
    }

    const baseUrl = createApiUrl(subdomain);
    config.baseURL = baseUrl;

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
          const authUrl = createApiUrl('auth');
          const response = await axios.post(`${authUrl}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });

          const accessToken = response.data;
          await storeToken(accessToken);

          error.config.headers["Authorization"] = `Bearer ${accessToken.access_token}`;

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

export const createAxiosInstance = (subdomain = '') => {
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
      if (error.response?.status === 401) {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          try {
            const authInstance = createAxiosInstance('auth');
            const response = await authInstance.post('/auth/refresh-token', {
              refresh_token: refreshToken,
            });

            const accessToken = response.data;
            await storeToken(accessToken);

            error.config.headers["Authorization"] = `Bearer ${accessToken.access_token}`;
            return instance(error.config);
          } catch (refreshError) {
            console.error("Erro ao tentar atualizar o token:", refreshError);
          }
        }
        await removeTokens();
      }
      return Promise.reject(new Error(error.message));
    }
  );

  return instance;
};

export const authAxios = createAxiosInstance('auth');
export const rideAxios = createAxiosInstance('ride');

export default axiosInstance;