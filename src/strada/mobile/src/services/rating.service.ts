import { rideAxios } from "./helpers/interceptors";

export interface CreateRatingData {
  rideId: string;
  ratedId: string;
  rating: number;
  comment?: string;
  type: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER";
}

export interface UpdateRatingData {
  rating?: number;
  comment?: string;
}

export interface RatingFilters {
  limit?: number;
  page?: number;
  maxRating?: number;
  minRating?: number;
  type?: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER";
  ratedId?: string;
  raterId?: string;
  rideId?: string;
}

export interface RatingStatistics {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface RatingSummary {
  asDriver: RatingStatistics;
  asPassenger: RatingStatistics;
  overall: {
    averageRating: number;
    totalRatings: number;
  };
}

// Criar uma nova avaliação
export const createRating = async (ratingData: CreateRatingData) => {
  try {
    const response = await rideAxios.post(`/ratings`, ratingData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    throw error;
  }
};

// Obter avaliação por ID
export const getRatingById = async (id: string) => {
  try {
    const response = await rideAxios.get(`/ratings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    throw error;
  }
};

// Obter avaliações de uma corrida
export const getRatingsByRideId = async (rideId: string) => {
  try {
    const response = await rideAxios.get(`/ratings/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações da corrida:", error);
    throw error;
  }
};

// Obter avaliações de um usuário
export const getRatingsByUserId = async (userId: string, type?: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER") => {
  try {
    const params = type ? { type } : {};
    const response = await rideAxios.get(`/ratings/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações do usuário:", error);
    throw error;
  }
};

// Obter avaliações feitas pelo usuário logado
export const getMyRatings = async () => {
  try {
    const response = await rideAxios.get(`/ratings/my-ratings`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar minhas avaliações:", error);
    throw error;
  }
};

// Atualizar uma avaliação
export const updateRating = async (id: string, ratingData: UpdateRatingData) => {
  try {
    const response = await rideAxios.put(`/ratings/${id}`, ratingData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    throw error;
  }
};

// Deletar uma avaliação
export const deleteRating = async (id: string) => {
  try {
    const response = await rideAxios.delete(`/ratings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar avaliação:", error);
    throw error;
  }
};

// Buscar avaliações com filtros
export const getRatingsWithFilters = async (filters: RatingFilters) => {
  try {
    const response = await rideAxios.get(`/ratings/search/filters`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações com filtros:", error);
    throw error;
  }
};

// Obter estatísticas de avaliação de um usuário
export const getRatingStatistics = async (userId: string, type?: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER") => {
  try {
    const params = type ? { type } : {};
    const response = await rideAxios.get(`/ratings/user/${userId}/statistics`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas de avaliação:", error);
    throw error;
  }
};

// Obter nota média de um usuário
export const getAverageRating = async (userId: string, type?: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER") => {
  try {
    const params = type ? { type } : {};
    const response = await rideAxios.get(`/ratings/user/${userId}/average`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar nota média:", error);
    throw error;
  }
};

// Obter resumo completo de avaliações de um usuário
export const getRatingSummary = async (userId: string) => {
  try {
    const response = await rideAxios.get(`/ratings/user/${userId}/summary`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar resumo de avaliações:", error);
    throw error;
  }
};

// Função conveniente para avaliar uma corrida
export const rateRide = async (

  rideId: string,
  ratedId: string,
  rating: number,
  comment: string,
  type: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER"
) => {
  try {
    const ratingData: CreateRatingData = {
      rideId,
      ratedId,
      rating,
      comment: comment.trim() || undefined,
      type
    };

    const response = await createRating(ratingData);
    return response;
  } catch (error) {
    console.error("Erro ao avaliar corrida:", error);
    throw error;
  }
};