import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMovie } from "@/services/movie";
import type { MovieResponse, UpdateMovieRequest } from "@/types/movie";

interface UpdateMoviePayload {
	movieId: string;
	data: UpdateMovieRequest;
}

export const useUpdateMovie = () => {
	const queryClient = useQueryClient();

	return useMutation<MovieResponse, Error, UpdateMoviePayload>({
		mutationFn: ({ movieId, data }) => updateMovie(movieId, data),
		onSuccess: (_, { movieId }) => {
			queryClient.invalidateQueries({ queryKey: ["admin-movie", movieId] });
			queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
};
