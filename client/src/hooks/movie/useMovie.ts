import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/services/movie";

export const useMovie = (movieId: string | undefined) => {
  const query = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId!),
    enabled: !!movieId,
  });

  return {
    movie: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
