import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/movie";
import type { GetMoviesParams } from "@/types/movie";

export const useMovies = (params?: GetMoviesParams) => {
  const query = useQuery({
    queryKey: ["movies", params],
    queryFn: () => getMovies(params),
  });

  return {
    movies: query.data?.data.data ?? [],
    metadata: query.data?.data.metadata,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
