import * as SecureStore from "expo-secure-store";
import { IAccessToken } from "../interfaces/access-token.interface";

export const storeToken = async (accessToken: IAccessToken) => {
  await SecureStore.setItemAsync("accessToken", accessToken.access_token);
  await SecureStore.setItemAsync("refreshToken", accessToken.refresh_token);
};

export const getStoredToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

export const getStoredRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

export const getStoredExpiresIn = async () => {
  return await SecureStore.getItemAsync("expiresIn");
};

export const removeTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("expiresIn");
};