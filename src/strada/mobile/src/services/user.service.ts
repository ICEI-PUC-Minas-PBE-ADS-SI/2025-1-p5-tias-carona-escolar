import * as SecureStore from "expo-secure-store";
import axiosInstance from "./helpers/interceptors";
import { IUserRequest } from "../interfaces/user-request.interface";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const createUser = async (user: IUserRequest) => {
  try {
    const response = await axiosInstance.post(`/users`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id: string, user: IUserRequest) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const storeUserID = async (id: string) => {
    await SecureStore.setItemAsync("userID", id);
};

export const getStoredUser = async () => {
  return await SecureStore.getItemAsync("user");
}

export const storeUser = async (user: IUserRequest) => {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export const getStoredUserID = async () => {
  return await SecureStore.getItemAsync("userID");
};

export const removeStoredUserID = async () => {
  await SecureStore.deleteItemAsync("userID");
};