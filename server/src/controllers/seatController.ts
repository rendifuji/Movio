import type { Request, Response } from "express";
import SeatService from "../services/seatService.js";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { broadcastSeatLocked, broadcastSeatReleased } from "../lib/socket.js";

interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: string;
	};
}

class SeatController {
	static async getSeats(req: Request, res: Response) {
		try {
			const { scheduleId } = req.params;

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			const seatsData = await SeatService.getSeatsForSchedule(scheduleId);

			return successRes(res, seatsData, "Seats retrieved successfully");
		} catch (error) {
			if (error instanceof Error && error.message === "Schedule not found") {
				return errNotFound(res, "Schedule not found");
			}
			return errInternalServer(res, error);
		}
	}

	static async lockSeat(req: AuthenticatedRequest, res: Response) {
		try {
			const { scheduleId, seatLabel } = req.body;
			const userId = req.user?.id;

			if (!userId) {
				return errBadRequest(res, "User not authenticated");
			}

			if (!scheduleId || !seatLabel) {
				return errBadRequest(res, "Schedule ID and seat label are required");
			}

			const result = await SeatService.lockSeat(scheduleId, seatLabel, userId);

			if (!result.success) {
				return errBadRequest(res, result.message);
			}

			broadcastSeatLocked(scheduleId, seatLabel, userId);

			return successRes(
				res,
				{ scheduleId, seatLabel, lockedBy: userId },
				result.message
			);
		} catch (error) {
			if (error instanceof Error && error.message === "Schedule not found") {
				return errNotFound(res, "Schedule not found");
			}
			return errInternalServer(res, error);
		}
	}

	static async unlockSeat(req: AuthenticatedRequest, res: Response) {
		try {
			const { scheduleId, seatLabel } = req.body;
			const userId = req.user?.id;

			if (!userId) {
				return errBadRequest(res, "User not authenticated");
			}

			if (!scheduleId || !seatLabel) {
				return errBadRequest(res, "Schedule ID and seat label are required");
			}

			const result = await SeatService.unlockSeat(scheduleId, seatLabel, userId);

			if (!result.success) {
				return errBadRequest(res, result.message);
			}

			broadcastSeatReleased(scheduleId, seatLabel, userId);

			return successRes(
				res,
				{ scheduleId, seatLabel, releasedBy: userId },
				result.message
			);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}

	static async unlockAllSeats(req: AuthenticatedRequest, res: Response) {
		try {
			const { scheduleId } = req.body;
			const userId = req.user?.id;

			if (!userId) {
				return errBadRequest(res, "User not authenticated");
			}

			if (!scheduleId) {
				return errBadRequest(res, "Schedule ID is required");
			}

			const releasedSeats = await SeatService.unlockAllUserSeats(
				scheduleId,
				userId
			);

			for (const seatLabel of releasedSeats) {
				broadcastSeatReleased(scheduleId, seatLabel, userId);
			}

			return successRes(
				res,
				{ scheduleId, releasedSeats, releasedBy: userId },
				`Released ${releasedSeats.length} seats`
			);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}
}

export default SeatController;
