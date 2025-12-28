import SeatRepository from "../repositories/seatRepository.js";
import SeatLockService from "./seatLockService.js";
import type { SeatStatus, GetSeatsResponse } from "../types/seatType.js";

class SeatService {
	private static generateSeatLabels(capacity: number): string[] {
		const seats: string[] = [];
		const seatsPerRow = 20;
		const rows = Math.ceil(capacity / seatsPerRow);

		for (let row = 0; row < rows; row++) {
			const rowLetter = String.fromCharCode(65 + row);
			const seatsInThisRow = Math.min(seatsPerRow, capacity - row * seatsPerRow);
			for (let seat = 1; seat <= seatsInThisRow; seat++) {
				seats.push(`${rowLetter}${seat}`);
			}
		}

		return seats;
	}

	static async getSeatsForSchedule(scheduleId: string): Promise<GetSeatsResponse> {
		const schedule = await SeatRepository.getScheduleWithStudio(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		const capacity = schedule.studio.capacity || 100; 
		const allSeatLabels = this.generateSeatLabels(capacity);

		const bookedSeats = await SeatRepository.getBookedSeats(scheduleId);
		const bookedSet = new Set(bookedSeats);

		const lockedSeats = await SeatLockService.getLockedSeats(scheduleId);
		const lockedMap = new Map(lockedSeats.map((s) => [s.seatLabel, s]));

		const seats: SeatStatus[] = allSeatLabels.map((seatLabel) => {
			if (bookedSet.has(seatLabel)) {
				return { seatLabel, status: "booked" };
			}

			const lockInfo = lockedMap.get(seatLabel);
			if (lockInfo) {
				return {
					seatLabel,
					status: "locked",
					lockedBy: lockInfo.lockedBy,
					lockedAt: lockInfo.lockedAt,
				};
			}

			return { seatLabel, status: "available" };
		});

		const bookedCount = seats.filter((s) => s.status === "booked").length;
		const lockedCount = seats.filter((s) => s.status === "locked").length;
		const availableCount = seats.filter((s) => s.status === "available").length;

		return {
			scheduleId,
			totalSeats: capacity,
			availableCount,
			lockedCount,
			bookedCount,
			seats,
		};
	}

	static async lockSeat(
		scheduleId: string,
		seatLabel: string,
		userId: string
	): Promise<{ success: boolean; message: string }> {
		const scheduleExists = await SeatRepository.scheduleExists(scheduleId);
		if (!scheduleExists) {
			throw new Error("Schedule not found");
		}

		const bookedSeats = await SeatRepository.getBookedSeats(scheduleId);
		if (bookedSeats.includes(seatLabel)) {
			return { success: false, message: "Seat is already booked" };
		}

		const lockStatus = await SeatLockService.isSeatLocked(scheduleId, seatLabel);
		if (lockStatus.locked && lockStatus.lockedBy !== userId) {
			return { success: false, message: "Seat is locked by another user" };
		}

		if (lockStatus.locked && lockStatus.lockedBy === userId) {
			await SeatLockService.forceUnlockSeat(scheduleId, seatLabel);
		}

		const locked = await SeatLockService.lockSeat(scheduleId, seatLabel, userId);
		if (!locked) {
			return { success: false, message: "Failed to lock seat" };
		}

		return { success: true, message: "Seat locked successfully" };
	}

	static async unlockSeat(
		scheduleId: string,
		seatLabel: string,
		userId: string
	): Promise<{ success: boolean; message: string }> {
		const unlocked = await SeatLockService.unlockSeat(
			scheduleId,
			seatLabel,
			userId
		);

		if (!unlocked) {
			return { success: false, message: "Seat not locked by you or already released" };
		}

		return { success: true, message: "Seat unlocked successfully" };
	}

	static async unlockAllUserSeats(
		scheduleId: string,
		userId: string
	): Promise<string[]> {
		return await SeatLockService.unlockAllUserSeats(scheduleId, userId);
	}
}

export default SeatService;
