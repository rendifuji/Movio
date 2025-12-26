import type { Request, Response } from "express";
import { z } from "zod";
import TransactionService from "../services/transactionService.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import {
	createCheckoutSchema,
	ticketIdSchema,
} from "../validators/transactionValidation.js";
import type { ValidationRequest } from "../middlewares/middlewareType.js";

class TransactionController {
	static async checkout(req: Request, res: Response) {
		try {
			const validationReq = req as ValidationRequest;
			const userId = validationReq.user?.id;

			if (!userId) {
				return errBadRequest(res, "User ID is required");
			}

			const validatedData = createCheckoutSchema.parse(req.body);

			const result = await TransactionService.checkout(userId, validatedData);

			return successRes(res, result, "Checkout successful", 201);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return errBadRequest(res, "Validation failed", error);
			}

			if (error instanceof Error) {
				if (
					error.message === "Schedule not found" ||
					error.message === "User not found"
				) {
					return errNotFound(res, error.message);
				}

				if (error.message.startsWith("Seats already booked")) {
					return errBadRequest(res, error.message);
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async getMyTickets(req: Request, res: Response) {
		try {
			const validationReq = req as ValidationRequest;
			const userId = validationReq.user?.id;

			if (!userId) {
				return errBadRequest(res, "User ID is required");
			}

			const result = await TransactionService.getMyTickets(userId);

			return successRes(res, result, "Tickets retrieved successfully");
		} catch (error) {
			return errInternalServer(res, error);
		}
	}

	static async getTicketById(req: Request, res: Response) {
		try {
			const validationReq = req as ValidationRequest;
			const userId = validationReq.user?.id;

			if (!userId) {
				return errBadRequest(res, "User ID is required");
			}

			const { ticketId } = ticketIdSchema.parse(req.params);

			const result = await TransactionService.getTicketById(ticketId, userId);

			return successRes(res, result, "Ticket retrieved successfully");
		} catch (error) {
			if (error instanceof z.ZodError) {
				return errBadRequest(res, "Validation failed", error);
			}

			if (error instanceof Error) {
				if (error.message === "Ticket not found") {
					return errNotFound(res, error.message);
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async getBookedSeats(req: Request, res: Response) {
		try {
			const scheduleId = req.params.scheduleId;

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			const result = await TransactionService.getBookedSeats(scheduleId);

			return successRes(res, result, "Booked seats retrieved successfully");
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Schedule not found") {
					return errNotFound(res, error.message);
				}
			}

			return errInternalServer(res, error);
		}
	}

	static async getAdminDashboard(req: Request, res: Response) {
		try {
			const result = await TransactionService.getAdminDashboard();

			return successRes(res, result, "Dashboard data retrieved successfully");
		} catch (error) {
			return errInternalServer(res, error);
		}
	}
}

export default TransactionController;
