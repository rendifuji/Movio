import type { ApiResponse } from "./auth";

export type MovieGenre =
  | "ACTION"
  | "COMEDY"
  | "DRAMA"
  | "HORROR"
  | "ROMANCE"
  | "SCI_FI"
  | "THRILLER"
  | "ANIMATION"
  | "FANTASY"
  | "DOCUMENTARY";

export type MovieStatus = "NOW_SHOWING" | "COMING_SOON";

export interface Movie {
  movieId: string;
  title: string;
  description: string;
  releaseDate: string;
  durationMinutes: number;
  genre: MovieGenre;
  posterUrl: string;
  rating: string;
  status: MovieStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MovieListData {
  data: Movie[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  genre?: MovieGenre;
  status?: MovieStatus;
}

export type MovieListResponse = ApiResponse<MovieListData>;

export type MovieResponse = ApiResponse<Movie>;

export type CreateMovieRequest = {
  title: string;
  description: string;
  releaseDate: string;
  durationMinutes: number;
  genre: MovieGenre;
  posterUrl: string;
  rating: string;
  status: MovieStatus;
};

export type UpdateMovieRequest = Partial<CreateMovieRequest>;
