import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMovie } from "@/services/movie";

export const useDeleteMovie = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (movieId) => deleteMovie(movieId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
};
