import API from "./api";
import type { ApiResponse } from "@/types/auth";

export interface Cinema {
  cinemaId: string;
  name: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CinemaListData {
  data: Cinema[];
  metadata?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type CinemaListResponse = ApiResponse<CinemaListData>;

export const cinemaService = {
  getCinemas: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
  }): Promise<CinemaListResponse> => {
    const response = await API.get<CinemaListResponse>("/cinema", {
      params,
    });
    return response.data;
  },
};
