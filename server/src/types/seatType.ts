export interface SeatStatus {
	seatLabel: string;
	status: "available" | "locked" | "booked";
	lockedBy?: string;
	lockedAt?: number;
}

export interface LockSeatRequest {
	scheduleId: string;
	seatLabel: string;
}

export interface UnlockSeatRequest {
	scheduleId: string;
	seatLabel: string;
}

export interface GetSeatsResponse {
	scheduleId: string;
	totalSeats: number;
	availableCount: number;
	lockedCount: number;
	bookedCount: number;
	seats: SeatStatus[];
}
