import type { ApiResponse } from "./auth";

export interface Schedule {
  scheduleId: string;
  movieId: string;
  movieTitle?: string;
  cinemaId: string;
  cinemaName?: string;
  studioId: string;
  studioName?: string;
  date: string;
  startTime: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetSchedulesParams {
  movieId?: string;
  cinemaId?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface ScheduleListData {
  data: Schedule[];
  metadata?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type ScheduleListResponse = ApiResponse<ScheduleListData>;
export type ScheduleResponse = ApiResponse<Schedule>;
