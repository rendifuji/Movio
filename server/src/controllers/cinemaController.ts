import type { Request, Response } from "express";
import CinemaService from "../services/cinemaService.js";
import {
	createCinemaSchema,
	updateCinemaSchema,
} from "../validators/cinemaValidation.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { ZodError } from "zod";

class CinemaController {
	static async createCinema(req: Request, res: Response) {
		try {
			const validatedData = createCinemaSchema.parse(req.body);

			const cinema = await CinemaService.createCinema(validatedData);

			return successRes(
				res,
				cinema,
				"Cinema has been created successfully",
				201
			);
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			return errInternalServer(res, error);
		}
	}

	static async updateCinema(req: Request, res: Response) {
		try {
			const cinemaId = req.params.cinemaId;

			if (!cinemaId) {
				return errBadRequest(res, "Cinema ID is required");
			}

			const validatedData = updateCinemaSchema.parse(req.body);

			const cinema = await CinemaService.updateCinema(validatedData, cinemaId);

			return successRes(res, cinema, "Cinema has been updated successfully");
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error && error.message === "Cinema not found") {
				return errNotFound(res, "Cinema not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async deleteCinema(req: Request, res: Response) {
		try {
			const cinemaId = req.params.cinemaId;

			if (!cinemaId) {
				return errBadRequest(res, "Cinema ID is required");
			}

			await CinemaService.deleteCinema(cinemaId);

			return successRes(res, null, "Cinema has been deleted successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Cinema not found") {
				return errNotFound(res, "Cinema not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getCinemaById(req: Request, res: Response) {
		try {
			const cinemaId = req.params.cinemaId;

			if (!cinemaId) {
				return errBadRequest(res, "Cinema ID is required");
			}

			const cinema = await CinemaService.getCinemaById(cinemaId);

			return successRes(res, cinema, "Cinema retrieved successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Cinema not found") {
				return errNotFound(res, "Cinema not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getCinemas(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const search = (req.query.search as string) || undefined;
			const city = (req.query.city as string) || undefined;
			const sortBy = (req.query.sortBy as string) || undefined;

			const result = await CinemaService.getCinemas(
				search,
				city,
				page,
				limit,
				sortBy
			);

			let message;

			let filterMsg = [];
			if (search) filterMsg.push(`search "${search}"`);
			if (city) filterMsg.push(`city "${city}"`);

			if (result.data.length === 0) {
				message =
					filterMsg.length > 0
						? `No cinemas found for ${filterMsg.join(", ")}`
						: "No cinemas available";
			} else {
				message =
					filterMsg.length > 0
						? `Cinemas retrieved successfully for ${filterMsg.join(", ")}`
						: "All cinemas retrieved successfully";
			}

			return successRes(res, result, message);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}
}

export default CinemaController;
