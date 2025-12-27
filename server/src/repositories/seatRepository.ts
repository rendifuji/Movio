import { prisma } from "../lib/prisma.js";

class SeatRepository {
	static async getBookedSeats(scheduleId: string): Promise<string[]> {
		const tickets = await prisma.ticket.findMany({
			where: {
				scheduleId,
				status: {
					in: ["VALID", "USED"],
				},
			},
			select: {
				seatLabel: true,
			},
		});

		return tickets.map((t: { seatLabel: string }) => t.seatLabel);
	}

	static async getScheduleWithStudio(scheduleId: string) {
		return await prisma.schedule.findUnique({
			where: { scheduleId },
			include: {
				studio: true,
				movie: true,
			},
		});
	}

	static async scheduleExists(scheduleId: string): Promise<boolean> {
		const schedule = await prisma.schedule.findUnique({
			where: { scheduleId },
		});
		return !!schedule;
	}
}

export default SeatRepository;
