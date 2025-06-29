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
    console.log("getting user\n\n");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id: string, user: IUserRequest) => {
  try {
    console.log("updating user");
    console.log(user);
    const response = await authAxios.put(`/users/${id}`, user);
    console.log("sent");
    console.log(response.data);
    storeUser(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Interface para dados do dependente
export interface IDependentData {
  name: string;
  email: string;
  username: string;
  phone?: string;
  birthDate?: string;
  relationship: "PARENT" | "LEGAL_GUARDIAN" | "RELATIVE" | "AUTHORIZED_ADULT";
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
}

// Interface para relação de responsabilidade
export interface IGuardianRelation {
  guardianId: string;
  minorId: string;
  relationship: "PARENT" | "LEGAL_GUARDIAN" | "RELATIVE" | "AUTHORIZED_ADULT";
  canRequestRides?: boolean;
  canAcceptRides?: boolean;
}

// Função para criar dependente (cria usuário + relação)
export const createDependent = async (dependentData: IDependentData, guardianId: string) => {
  try {
    // Função para converter data para formato ISO-8601
    const formatDate = (dateString?: string): Date | null => {
      if (!dateString) return null;
      // Se a data está no formato DD/MM/AAAA, converte para ISO
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Mês começa em 0
          const year = parseInt(parts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
        }
      }
      // Tenta converter string para Date (para outros formatos)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Se não conseguir converter, retorna null
        return null;
      }
      return date;
    };

    // 1. Primeiro, criar o usuário dependente (menor)
    const dependentUserData = {
      name: dependentData.name,
      email: dependentData.email,
      username: dependentData.username,
      phone: dependentData.phone || null,
      birthDate: formatDate(dependentData.birthDate),
      address: dependentData.address || null,
      city: dependentData.city || null,
      state: dependentData.state || null,
      cep: dependentData.cep || null,
      userType: "MINOR" as const,
      password: "temp123456", // Senha temporária que será alterada pelo usuário
    };

    const createUserResponse = await authAxios.post(`/users`, dependentUserData);
    const createdUser = createUserResponse.data;

    // 2. Depois, criar a relação de responsabilidade
    const guardianRelationData: IGuardianRelation = {
      guardianId: guardianId,
      minorId: createdUser.id,
      relationship: dependentData.relationship, // Já é um valor válido do enum GuardianType
      canRequestRides: true,
      canAcceptRides: true,
    };

    await authAxios.post(`/guardians/relations`, guardianRelationData);

    return createdUser;
  } catch (error) {
    console.error("Erro ao criar dependente:", error);
    throw error;
  }
};

// Função para remover dependente (remove apenas a relação)
export const removeDependent = async (guardianId: string, minorId: string) => {
  try {
    await authAxios.delete(`/guardians/relations/${guardianId}/${minorId}`);
  } catch (error) {
    console.error("Erro ao remover dependente:", error);
    throw error;
  }
};

// Função para buscar dependentes de um responsável
export const getDependents = async (guardianId: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await authAxios.get(`/guardians/${guardianId}/minors`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dependentes:", error);
    throw error;
  }
};

// Função para buscar responsáveis de um menor
export const getGuardians = async (minorId: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await authAxios.get(`/guardians/minors/${minorId}/guardians`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar responsáveis:", error);
    throw error;
  }
};

export const storeUserID = async (id: string) => {
  await SecureStore.setItemAsync("userID", id);
};

export const getStoredUser = async () => {
  const user = await SecureStore.getItemAsync("user");
  return user;
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
