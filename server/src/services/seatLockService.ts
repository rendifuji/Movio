import { redis } from "../lib/redis.js";

const SEAT_LOCK_TTL = 600;
const SEAT_KEY_PREFIX = "seat";

export interface LockedSeat {
	seatLabel: string;
	lockedBy: string;
	lockedAt: number;
}

class SeatLockService {
	private static getSeatKey(scheduleId: string, seatLabel: string): string {
		return `${SEAT_KEY_PREFIX}:${scheduleId}:${seatLabel}`;
	}

	static async lockSeat(
		scheduleId: string,
		seatLabel: string,
		userId: string
	): Promise<boolean> {
		const key = this.getSeatKey(scheduleId, seatLabel);
		const value = JSON.stringify({
			userId,
			lockedAt: Date.now(),
		});

		const result = await redis.set(key, value, "EX", SEAT_LOCK_TTL, "NX");
		return result === "OK";
	}

	static async unlockSeat(
		scheduleId: string,
		seatLabel: string,
		userId: string
	): Promise<boolean> {
		const key = this.getSeatKey(scheduleId, seatLabel);
		const data = await redis.get(key);

		if (!data) return false;

		const lockInfo = JSON.parse(data);
		if (lockInfo.userId !== userId) return false;

		await redis.del(key);
		return true;
	}

	static async forceUnlockSeat(
		scheduleId: string,
		seatLabel: string
	): Promise<boolean> {
		const key = this.getSeatKey(scheduleId, seatLabel);
		const result = await redis.del(key);
		return result > 0;
	}

	static async getLockedSeats(scheduleId: string): Promise<LockedSeat[]> {
		const pattern = `${SEAT_KEY_PREFIX}:${scheduleId}:*`;
		const keys = await redis.keys(pattern);

		if (keys.length === 0) return [];

		const lockedSeats: LockedSeat[] = [];

		for (const key of keys) {
			const data = await redis.get(key);
			if (data) {
				const parts = key.split(":");
				const seatLabel = parts[2];
				if (seatLabel) {
					const lockInfo = JSON.parse(data);
					lockedSeats.push({
						seatLabel,
						lockedBy: lockInfo.userId,
						lockedAt: lockInfo.lockedAt,
					});
				}
			}
		}

		return lockedSeats;
	}

	static async isSeatLocked(
		scheduleId: string,
		seatLabel: string
	): Promise<{ locked: boolean; lockedBy?: string }> {
		const key = this.getSeatKey(scheduleId, seatLabel);
		const data = await redis.get(key);

		if (!data) return { locked: false };

		const lockInfo = JSON.parse(data);
		return { locked: true, lockedBy: lockInfo.userId };
	}

	static async getSeatLockTTL(
		scheduleId: string,
		seatLabel: string
	): Promise<number> {
		const key = this.getSeatKey(scheduleId, seatLabel);
		return await redis.ttl(key);
	}

	static async unlockAllUserSeats(
		scheduleId: string,
		userId: string
	): Promise<string[]> {
		const lockedSeats = await this.getLockedSeats(scheduleId);
		const unlockedSeats: string[] = [];

		for (const seat of lockedSeats) {
			if (seat.lockedBy === userId) {
				await this.forceUnlockSeat(scheduleId, seat.seatLabel);
				unlockedSeats.push(seat.seatLabel);
			}
		}

		return unlockedSeats;
	}
}

export default SeatLockService;
