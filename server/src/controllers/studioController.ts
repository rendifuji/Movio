import type { Request, Response } from "express";
import StudioService from "../services/studioService.js";
import {
	createStudioSchema,
	updateStudioSchema,
} from "../validators/studioValidation.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { ZodError } from "zod";

class StudioController {
	static async createStudio(req: Request, res: Response) {
		try {
			const validatedData = createStudioSchema.parse(req.body);

			const studio = await StudioService.createStudio(validatedData);

			return successRes(
				res,
				studio,
				"Studio has been created successfully",
				201
			);
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

	static async updateStudio(req: Request, res: Response) {
		try {
			const studioId = req.params.studioId;

			if (!studioId) {
				return errBadRequest(res, "Studio ID is required");
			}

			const validatedData = updateStudioSchema.parse(req.body);

			const studio = await StudioService.updateStudio(validatedData, studioId);

			return successRes(res, studio, "Studio has been updated successfully");
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error) {
				if (error.message === "Studio not found") {
					return errNotFound(res, "Studio not found");
				}
				if (error.message === "Cinema not found") {
					return errNotFound(res, "Cinema not found");
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async deleteStudio(req: Request, res: Response) {
		try {
			const studioId = req.params.studioId;

			if (!studioId) {
				return errBadRequest(res, "Studio ID is required");
			}

			await StudioService.deleteStudio(studioId);

			return successRes(res, null, "Studio has been deleted successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Studio not found") {
				return errNotFound(res, "Studio not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getStudioById(req: Request, res: Response) {
		try {
			const studioId = req.params.studioId;

			if (!studioId) {
				return errBadRequest(res, "Studio ID is required");
			}

			const studio = await StudioService.getStudioById(studioId);

			return successRes(res, studio, "Studio retrieved successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Studio not found") {
				return errNotFound(res, "Studio not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getStudios(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const cinemaId = (req.query.cinemaId as string) || undefined;
			const search = (req.query.search as string) || undefined;
			const sortBy = (req.query.sortBy as string) || undefined;

			const result = await StudioService.getStudios(
				cinemaId,
				search,
				page,
				limit,
				sortBy
			);

			let message;

			let filterMsg = [];
			if (cinemaId) filterMsg.push(`cinema "${cinemaId}"`);
			if (search) filterMsg.push(`search "${search}"`);

			if (result.data.length === 0) {
				message =
					filterMsg.length > 0
						? `No studios found for ${filterMsg.join(", ")}`
						: "No studios available";
			} else {
				message =
					filterMsg.length > 0
						? `Studios retrieved successfully for ${filterMsg.join(", ")}`
						: "All studios retrieved successfully";
			}

			return successRes(res, result, message);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}
}

export default StudioController;
