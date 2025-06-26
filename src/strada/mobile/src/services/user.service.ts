import * as SecureStore from "expo-secure-store";
import { authAxios } from "./helpers/interceptors";
import { IUserRequest } from "../interfaces/user-request.interface";

export const createUser = async (user: IUserRequest) => {
  try {
    console.log(user);
    console.log(authAxios.defaults);
    const response = await authAxios.post(`/users`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await authAxios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id: string, user: IUserRequest) => {
  try {
    const response = await authAxios.put(`/users/${id}`, user);
    storeUser(response.data);
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
};

export const storeUser = async (user: Partial<IUserRequest>) => {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};

export const getStoredUserID = async () => {
  return await SecureStore.getItemAsync("userID");
};

export const removeStoredUserID = async () => {
  await SecureStore.deleteItemAsync("userID");
};
