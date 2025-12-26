import { MovieStatus, MovieGenre } from "@prisma/client";
import MovieRepository from "../repositories/movieRepository.js";
import type {
	CreateMovieRequest,
	UpdateMovieRequest,
} from "../types/movieType.js";

class MovieService {
	  static async getMovieById(movieId: string) {
    return await MovieRepository.getMovieById(movieId);
  }

	static async createMovie(data: CreateMovieRequest) {
		// Validate duration
		if (data.durationMinutes <= 0) {
			throw new Error("Duration must be greater than 0");
		}

		// Validate status
		if (!Object.values(MovieStatus).includes(data.status)) {
			throw new Error("Invalid movie status");
		}

		return await MovieRepository.createMovie(data);
	}

	static async updateMovie(data: UpdateMovieRequest, movieId: string) {
		const existingMovie = await MovieRepository.getMovieById(movieId);
		if (!existingMovie) {
			throw new Error("Movie not found");
		}

		return await MovieRepository.updateMovie(data, movieId);
	}

	static async deleteMovie(movieId: string) {
		const existingMovie = await MovieRepository.getMovieById(movieId);
		if (!existingMovie) {
			throw new Error("Movie not found");
		}

		return await MovieRepository.deleteMovie(movieId);
	}

	static async getMovies(
		search?: string,
		page: number = 1,
		limit: number = 9,
		sortBy?: string,
		genre?: string,
		status?: string
	) {
		const genreEnum = genre
			? MovieGenre[genre.toUpperCase() as keyof typeof MovieGenre]
			: undefined;

		const statusEnum = status
			? MovieStatus[status.toUpperCase() as keyof typeof MovieStatus]
			: undefined;

		const [data, totalItems] = await Promise.all([
			MovieRepository.getMovies(
				search,
				page,
				limit,
				sortBy,
				genreEnum,
				statusEnum
			),
			MovieRepository.countMovies(search, genreEnum, statusEnum),
		]);

		const totalPages = Math.ceil(totalItems / limit);

		return {
			data,
			metadata: {
				page,
				limit,
				totalItems,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		};
	}
}

export default MovieService;
