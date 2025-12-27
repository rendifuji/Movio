import type {
  GetMoviesParams,
  MovieListResponse,
  MovieResponse,
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
