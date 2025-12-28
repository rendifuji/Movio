import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovie } from "@/services/movie";
import type { CreateMovieRequest, MovieResponse } from "@/types/movie";

export const useAddMovie = () => {
	const queryClient = useQueryClient();

	return useMutation<MovieResponse, Error, CreateMovieRequest>({
		mutationFn: (payload) => createMovie(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
};
