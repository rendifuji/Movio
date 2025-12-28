import API from "./api";
import type { ApiResponse } from "@/types/auth";

export interface Studio {
  studioId: string;
  name: string;
  cinemaId: string;
  totalSeats: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudioListData {
  data: Studio[];
  metadata?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type StudioListResponse = ApiResponse<StudioListData>;

export const studioService = {
  getStudios: async (params?: {
    cinemaId?: string;
    page?: number;
    limit?: number;
  }): Promise<StudioListResponse> => {
    const response = await API.get<StudioListResponse>("/studio/user", {
      params,
    });
    return response.data;
  },
};
