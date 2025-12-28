import type {
  GetMoviesParams,
  MovieListResponse,
  MovieResponse,
  CreateMovieRequest,
  UpdateMovieRequest,
} from "@/types/movie";
import API from "./api";

export const getMovies = async (
  params?: GetMoviesParams
): Promise<MovieListResponse> => {
  const response = await API.get<MovieListResponse>("/movie", { params });
  return response.data;
};

export const getMovieById = async (movieId: string): Promise<MovieResponse> => {
  const response = await API.get<MovieResponse>(`/movie/${movieId}`);
  return response.data;
};

export const createMovie = async (
  payload: CreateMovieRequest
): Promise<MovieResponse> => {
  const response = await API.post<MovieResponse>("/movie/admin", payload);
  return response.data;
};

export const updateMovie = async (
  movieId: string,
  payload: UpdateMovieRequest
): Promise<MovieResponse> => {
  const response = await API.put<MovieResponse>(
    `/movie/admin/${movieId}`,
    payload
  );
  return response.data;
};

export const deleteMovie = async (movieId: string): Promise<void> => {
  await API.delete(`/movie/admin/${movieId}`);
};
