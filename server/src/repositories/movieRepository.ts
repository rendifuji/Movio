import { MovieGenre, MovieStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
	CreateMovieRequest,
	UpdateMovieRequest,
} from "../types/movieType.js";

class MovieRepository {
	static async createMovie(data: CreateMovieRequest) {
		let { releaseDate, ...rest } = data;
		if (
			typeof releaseDate === "string" &&
			/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)
		) {
			releaseDate = `${releaseDate}T00:00:00.000Z`;
		}
		return await prisma.movie.create({
			data: {
				...rest,
				releaseDate,
			},
		});
	}

	static async updateMovie(data: UpdateMovieRequest, movieId: string) {
		let { releaseDate, ...rest } = data;
		if (
			typeof releaseDate === "string" &&
			/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)
		) {
			releaseDate = `${releaseDate}T00:00:00.000Z`;
		}
		return await prisma.movie.update({
			where: { movieId },
			data: {
				...rest,
				...(releaseDate !== undefined ? { releaseDate } : {}),
			},
		});
	}

	static async getMovieById(movieId: string) {
		return await prisma.movie.findUnique({
			where: { movieId },
		});
	}

	static async deleteMovie(movieId: string) {
		return await prisma.movie.delete({
			where: { movieId },
		});
	}

	static async getMovies(
		search?: string,
		page: number = 1,
		limit: number = 9,
		sortBy: string = "a-z",
		genre?: MovieGenre,
		status?: MovieStatus
	) {
		const skip = (page - 1) * limit;

		const where: any = {};

		if (search) {
			where.title = {
				contains: search,
				mode: "insensitive",
			};
		}

		if (genre) {
			where.genre = genre;
		}

		if (status) {
			where.status = status;
		}

		let orderBy: any = { createdAt: "desc" };

		const normalizedSort = (sortBy ?? "latest").toString().trim().toLowerCase();
		switch (normalizedSort) {
			case "a-z":
			case "az":
			case "title-asc":
				orderBy = { title: "asc" };
				break;
			case "z-a":
			case "za":
			case "title-desc":
				orderBy = { title: "desc" };
				break;
			case "rating-asc":
				orderBy = { rating: "asc" };
				break;
			case "rating-desc":
				orderBy = { rating: "desc" };
				break;
			case "duration-asc":
				orderBy = { durationMinutes: "asc" };
				break;
			case "duration-desc":
				orderBy = { durationMinutes: "desc" };
				break;
			case "oldest":
				orderBy = { createdAt: "asc" };
				break;
			case "latest":
			default:
				orderBy = { createdAt: "desc" };
		}

		return await prisma.movie.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			select: {
				movieId: true,
				title: true,
				description: true,
				durationMinutes: true,
				posterUrl: true,
				genre: true,
				rating: true,
				status: true,
			},
		});
	}

	static async countMovies(
		search?: string,
		genre?: MovieGenre,
		status?: MovieStatus
	) {
		const where: any = {};

		if (search) {
			where.title = {
				contains: search,
				mode: "insensitive",
			};
		}

		if (genre) {
			where.genre = genre;
		}

		if (status) {
			where.status = status;
		}

		return await prisma.movie.count({
			where,
		});
	}
}

export default MovieRepository;
