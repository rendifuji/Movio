import type { Request, Response } from "express";
import ScheduleService from "../services/scheduleService.js";
import {
	createScheduleSchema,
	updateScheduleSchema,
} from "../validators/scheduleValidation.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { ZodError } from "zod";

class ScheduleController {
	static async createSchedule(req: Request, res: Response) {
		try {
			const validatedData = createScheduleSchema.parse(req.body);

			const schedule = await ScheduleService.createSchedule(validatedData);

			const response = {
				...schedule,
				movie: schedule.movie?.title,
				studio: schedule.studio?.name,
				cinema: schedule.studio?.cinema?.name,
			};

			return successRes(
				res,
				response,
				"Schedule has been created successfully",
				201
			);
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error) {
				if (
					error.message === "Movie not found" ||
					error.message === "Cinema not found" ||
					error.message === "Studio not found"
				) {
					return errNotFound(res, error.message);
				}
				if (
					error.message === "Studio does not belong to the specified cinema"
				) {
					return errBadRequest(res, error.message);
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async updateSchedule(req: Request, res: Response) {
		try {
			const scheduleId = req.params.scheduleId;

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			const validatedData = updateScheduleSchema.parse(req.body);

			const schedule = await ScheduleService.updateSchedule(
				validatedData,
				scheduleId
			);

			return successRes(
				res,
				schedule,
				"Schedule has been updated successfully"
			);
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error) {
				if (error.message === "Schedule not found") {
					return errNotFound(res, "Schedule not found");
				}
				if (
					error.message === "Movie not found" ||
					error.message === "Cinema not found" ||
					error.message === "Studio not found"
				) {
					return errNotFound(res, error.message);
				}
				if (
					error.message === "Studio does not belong to the specified cinema"
				) {
					return errBadRequest(res, error.message);
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async deleteSchedule(req: Request, res: Response) {
		try {
			const scheduleId = req.params.scheduleId;

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			await ScheduleService.deleteSchedule(scheduleId);

			return successRes(res, null, "Schedule has been deleted successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Schedule not found") {
				return errNotFound(res, "Schedule not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getScheduleById(req: Request, res: Response) {
		try {
			const scheduleId = req.params.scheduleId;

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			const schedule = await ScheduleService.getScheduleById(scheduleId);

			return successRes(res, schedule, "Schedule retrieved successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Schedule not found") {
				return errNotFound(res, "Schedule not found");
			}

			return errInternalServer(res, error);
		}
	}

	static async getSchedules(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const studioName = (req.query.studioName as string) || undefined;
			const cinemaName = (req.query.cinemaName as string) || undefined;
			const search = (req.query.search as string) || undefined;
			const date = (req.query.date as string) || undefined;
			const sortBy = (req.query.sortBy as string) || undefined;

			const result = await ScheduleService.getSchedules(
				studioName,
				cinemaName,
				search,
				date,
				page,
				limit,
				sortBy
			);

			const transformedData = result.data.map((schedule: any) => ({
				scheduleId: schedule.scheduleId,
				movieId: schedule.movieId,
				studioId: schedule.studioId,
				date: schedule.date,
				startTime: schedule.startTime,
				endTime: schedule.endTime,
				price: schedule.price,
				createdAt: schedule.createdAt,
				updatedAt: schedule.updatedAt,
				movie: schedule.movie?.title || "Unknown Movie",
				studio: schedule.studio?.name || "Unknown Studio",
				cinema: schedule.studio?.cinema?.name || "Unknown Cinema",
			}));

			const transformedResult = {
				...result,
				data: transformedData,
			};

			let message;

			let filterMsg = [];
			if (studioName) filterMsg.push(`studio name "${studioName}"`);
			if (cinemaName) filterMsg.push(`cinema name "${cinemaName}"`);
			if (search) filterMsg.push(`movie title containing "${search}"`);
			if (date) filterMsg.push(`date "${date}"`);

			if (transformedResult.data.length === 0) {
				message =
					filterMsg.length > 0
						? `No schedules found for ${filterMsg.join(", ")}`
						: "No schedules available";
			} else {
				message =
					filterMsg.length > 0
						? `Schedules retrieved successfully for ${filterMsg.join(", ")}`
						: "All schedules retrieved successfully";
			}

			return successRes(res, transformedResult, message);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}
}

export default ScheduleController;
