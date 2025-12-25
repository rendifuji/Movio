import { prisma } from "../lib/prisma.js";
import type {
	CreateScheduleRequest,
	UpdateScheduleRequest,
} from "../types/scheduleType.js";

class ScheduleRepository {
	static async createSchedule(data: CreateScheduleRequest) {
		let { date, startTime, ...rest } = data;

		if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
			date = `${date}T00:00:00.000Z`;
		}

		const parsedStartTime = new Date(startTime);

		const movie = await prisma.movie.findUnique({
			where: { movieId: rest.movieId },
			select: { durationMinutes: true },
		});

		const durationMinutes = movie?.durationMinutes ?? 120;

		const endTime = new Date(
			parsedStartTime.getTime() + (durationMinutes + 15) * 60 * 1000
		);

		return await prisma.schedule.create({
			data: {
				movieId: rest.movieId,
				studioId: rest.studioId,
				date: new Date(date),
				startTime: parsedStartTime,
				endTime: endTime,
				price: rest.price,
			},
			include: {
				movie: true,
				studio: {
					include: {
						cinema: true,
					},
				},
			},
		});
	}

	static async updateSchedule(data: UpdateScheduleRequest, scheduleId: string) {
		let { date, startTime, ...rest } = data;

		const updateData: any = { ...rest };

		if (date) {
			if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
				date = `${date}T00:00:00.000Z`;
			}
			updateData.date = new Date(date);
		}

		if (startTime) {
			const parsedStartTime = new Date(startTime);
			updateData.startTime = parsedStartTime;

			let movieId = rest.movieId;
			if (!movieId) {
				const existing = await prisma.schedule.findUnique({
					where: { scheduleId },
					select: { movieId: true },
				});
				movieId = existing?.movieId;
			}

			let durationMinutes = 120;
			if (movieId) {
				const movie = await prisma.movie.findUnique({
					where: { movieId },
					select: { durationMinutes: true },
				});
				durationMinutes = movie?.durationMinutes ?? 120;
			}

			updateData.endTime = new Date(
				parsedStartTime.getTime() + (durationMinutes + 15) * 60 * 1000
			);
		}

		return await prisma.schedule.update({
			where: { scheduleId },
			data: updateData,
			include: {
				movie: true,
				studio: {
					include: {
						cinema: true,
					},
				},
			},
		});
	}

	static async getScheduleById(scheduleId: string) {
		return await prisma.schedule.findUnique({
			where: { scheduleId },
			include: {
				movie: true,
				studio: {
					include: {
						cinema: true,
					},
				},
			},
		});
	}

	static async deleteSchedule(scheduleId: string) {
		return await prisma.schedule.delete({
			where: { scheduleId },
		});
	}

	static async getSchedules(
		studioName?: string,
		cinemaName?: string,
		search?: string,
		date?: string,
		page: number = 1,
		limit: number = 10,
		sortBy: string = "date-asc"
	) {
		const skip = (page - 1) * limit;

		const where: any = {};

		if (search) {
			where.movie = {
				title: {
					contains: search,
					mode: "insensitive",
				},
			};
		}

		if (studioName) {
			where.studio = {
				...where.studio,
				name: {
					contains: studioName,
					mode: "insensitive",
				},
			};
		}

		if (cinemaName) {
			where.studio = {
				...where.studio,
				cinema: {
					name: {
						contains: cinemaName,
						mode: "insensitive",
					},
				},
			};
		}

		if (date) {
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			where.date = {
				gte: startOfDay,
				lte: endOfDay,
			};
		}

		let orderBy: any = { date: "asc" };

		const normalizedSort = (sortBy ?? "date-asc")
			.toString()
			.trim()
			.toLowerCase();
		switch (normalizedSort) {
			case "date-asc":
				orderBy = { date: "asc" };
				break;
			case "date-desc":
				orderBy = { date: "desc" };
                break;
            case "time-asc":
			case "starttime-asc":
				orderBy = { startTime: "asc" };
                break;
            case "time-desc":
			case "starttime-desc":
				orderBy = { startTime: "desc" };
				break;
			case "latest":
				orderBy = { createdAt: "desc" };
				break;
			case "oldest":
				orderBy = { createdAt: "asc" };
				break;
			default:
				orderBy = { date: "asc" };
		}

		return await prisma.schedule.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				movie: true,
				studio: {
					include: {
						cinema: true,
					},
				},
			},
		});
	}

	static async countSchedules(
		studioName?: string,
		cinemaName?: string,
		search?: string,
		date?: string,
	) {
		const where: any = {};

		if (search) {
			where.movie = {
				title: {
					contains: search,
					mode: "insensitive",
				},
			};
		}

		if (studioName) {
			where.studio = {
				...where.studio,
				name: {
					contains: studioName,
					mode: "insensitive",
				},
			};
		}

		if (cinemaName) {
			where.studio = {
				...where.studio,
				cinema: {
					name: {
						contains: cinemaName,
						mode: "insensitive",
					},
				},
			};
		}

		if (date) {
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			where.date = {
				gte: startOfDay,
				lte: endOfDay,
			};
		}

		return await prisma.schedule.count({ where });
	}

	static async checkMovieExists(movieId: string) {
		return await prisma.movie.findUnique({
			where: { movieId },
		});
	}

	static async checkStudioExists(studioId: string) {
		return await prisma.studio.findUnique({
			where: { studioId },
			include: {
				cinema: true,
			},
		});
	}

	static async checkCinemaExists(cinemaId: string) {
		return await prisma.cinema.findUnique({
			where: { cinemaId },
		});
	}

	static async checkStudioBelongsToCinema(studioId: string, cinemaId: string) {
		return await prisma.studio.findFirst({
			where: {
				studioId,
				cinemaId,
			},
		});
	}
}

export default ScheduleRepository;
