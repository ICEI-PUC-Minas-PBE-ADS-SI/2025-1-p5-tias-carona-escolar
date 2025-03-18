
import { ICreadentials } from "../interfaces/credentials.interface";
import { storeToken } from "./token.service";
import { storeUserID } from "./user.service";
import { IAccessToken } from "../interfaces/access-token.interface";
import axiosInstance from "./helpers/interceptors";
import { jwtDecode } from "jwt-decode";

export const getAccessToken = async (credentials: ICreadentials) => {
  try {
    const response = await axiosInstance.post(`/auth/token`, credentials);
    const accessToken = response.data;
    await storeToken(accessToken);
    const decoded = await decodeAccessToken(accessToken.access_token);
    if (decoded) {
      await storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post(`/auth/refresh-token`, {
      refresh_token: refreshToken,
    });
    const accessToken = response.data;
    await storeToken(accessToken);
    const decoded = await decodeAccessToken(accessToken.access_token);
    if (decoded) {
      await storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getRecoverPasswordToken = async (email: string) => {
  try {
    const response = await axiosInstance.post(
      `/auth/recover-password/token/${email}`
    );
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getAccessTokenWithGoogleToken = async (
  idToken: string
): Promise<IAccessToken> => {
  try {
    const data = {
      idToken: idToken,
    };
    const response = await axiosInstance.post(`/auth/redirect/google`, data);
    const accessToken = response.data;
    await storeToken(accessToken);
    const decoded = await decodeAccessToken(accessToken.access_token);
    if (decoded) {
      await storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.error("Erro ao enviar tokens para o backend:", error);
    throw error;
  }
};

export const getAccessTokenWithGithubCode = async (
  code: string
): Promise<IAccessToken> => {
  try {
    const response = await axiosInstance.post(`/auth/redirect/github`, {
      code,
    });
    const accessToken = response.data;
    await storeToken(accessToken);
    const decoded = await decodeAccessToken(accessToken.access_token);
    if (decoded) {
      await storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get access token. Please try again later.");
  }
};

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export function decodeAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar o token", error);
    return null;
  }
}