import type { Request, Response } from "express";
import MovieService from "../services/movieService.js";
import {
	createMovieSchema,
	updateMovieSchema,
} from "../validators/movieValidation.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { ZodError } from "zod";

class MovieController {
	static async createMovie(req: Request, res: Response) {
		try {
			const validatedData = createMovieSchema.parse(req.body);

			const movie = await MovieService.createMovie(validatedData);

			return successRes(res, movie, "Movie has been created successfully", 201);
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			return errInternalServer(res, error);
		}
	}

	static async updateMovie(req: Request, res: Response) {
		try {
			const movieId = req.params.movieId;

			if (!movieId) {
				return errBadRequest(res, "Movie ID is required");
			}

			const validatedData = updateMovieSchema.parse(req.body);

			const movie = await MovieService.updateMovie(validatedData, movieId);

			return successRes(res, movie, "Movie has been updated successfully");
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error && error.message === "Movie not found") {
				return errNotFound(res, "Movie not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async deleteMovie(req: Request, res: Response) {
		try {
			const movieId = req.params.movieId;

			if (!movieId) {
				return errBadRequest(res, "Movie ID is required");
			}

			await MovieService.deleteMovie(movieId);

			return successRes(res, null, "Movie has been deleted successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Movie not found") {
				return errNotFound(res, "Movie not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getMovies(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 9;
			const search = (req.query.search as string) || undefined;
			const sortBy = (req.query.sortBy as string) || undefined;
			const genre = (req.query.genre as string) || undefined;
			const status = (req.query.status as string) || undefined;

			const result = await MovieService.getMovies(
				search,
				page,
				limit,
				sortBy,
				genre,
				status
			);

			let message;

			let filterMsg = [];
			if (search) filterMsg.push(`search "${search}"`);
			if (genre) filterMsg.push(`genre "${genre}"`);
			if (status) filterMsg.push(`status "${status}"`);
			const filterStr =
				filterMsg.length > 0 ? ` for ${filterMsg.join(" and ")}` : "";

			if (result.metadata.totalItems === 0) {
				message = `No movies found${filterStr}`;
			} else {
				message = `Found ${result.metadata.totalItems} movies${filterStr}`;
			}

			return successRes(res, result, message);
		} catch (error) {
			if (error instanceof Error) {
				return errInternalServer(res, error);
			}

			return errInternalServer(res, error);
		}
	}
}

export default MovieController;
