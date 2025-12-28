import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/services/movie";
import type { MovieResponse } from "@/types/movie";

export const useAdminMovie = (movieId?: string) => {
	const query = useQuery<MovieResponse, Error>({
		queryKey: ["admin-movie", movieId],
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
