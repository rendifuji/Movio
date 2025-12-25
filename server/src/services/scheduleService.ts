import ScheduleRepository from "../repositories/scheduleRepository.js";
import type {
	CreateScheduleRequest,
	UpdateScheduleRequest,
} from "../types/scheduleType.js";

class ScheduleService {
	static async createSchedule(data: CreateScheduleRequest) {
		const movie = await ScheduleRepository.checkMovieExists(data.movieId);
		if (!movie) {
			throw new Error("Movie not found");
		}

		const cinema = await ScheduleRepository.checkCinemaExists(data.cinemaId);
		if (!cinema) {
			throw new Error("Cinema not found");
		}

		const studio = await ScheduleRepository.checkStudioExists(data.studioId);
		if (!studio) {
			throw new Error("Studio not found");
		}

		const studioBelongsToCinema =
			await ScheduleRepository.checkStudioBelongsToCinema(
				data.studioId,
				data.cinemaId
			);

		if (!studioBelongsToCinema) {
			throw new Error("Studio does not belong to the specified cinema");
		}

		if (data.price < 0) {
			throw new Error("Price must be at least 0");
		}

		return await ScheduleRepository.createSchedule(data);
	}

	static async updateSchedule(data: UpdateScheduleRequest, scheduleId: string) {
		const existingSchedule = await ScheduleRepository.getScheduleById(
			scheduleId
		);

		if (!existingSchedule) {
			throw new Error("Schedule not found");
		}

		if (data.movieId) {
			const movie = await ScheduleRepository.checkMovieExists(data.movieId);
			if (!movie) {
				throw new Error("Movie not found");
			}
		}

		if (data.cinemaId) {
			const cinema = await ScheduleRepository.checkCinemaExists(data.cinemaId);
			if (!cinema) {
				throw new Error("Cinema not found");
			}
		}

		if (data.studioId) {
			const studio = await ScheduleRepository.checkStudioExists(data.studioId);
			if (!studio) {
				throw new Error("Studio not found");
			}
		}

		if (data.studioId && data.cinemaId) {
			const studioBelongsToCinema =
				await ScheduleRepository.checkStudioBelongsToCinema(
					data.studioId,
					data.cinemaId
				);
			if (!studioBelongsToCinema) {
				throw new Error("Studio does not belong to the specified cinema");
			}
		}

		if (data.price !== undefined && data.price < 0) {
			throw new Error("Price must be at least 0");
		}

		return await ScheduleRepository.updateSchedule(data, scheduleId);
	}

	static async deleteSchedule(scheduleId: string) {
		const existingSchedule = await ScheduleRepository.getScheduleById(
			scheduleId
		);
		if (!existingSchedule) {
			throw new Error("Schedule not found");
		}

		return await ScheduleRepository.deleteSchedule(scheduleId);
	}

	static async getScheduleById(scheduleId: string) {
		const schedule = await ScheduleRepository.getScheduleById(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}
		return schedule;
	}

	static async getSchedules(
		studioName?: string,
		cinemaName?: string,
		search?: string,
		date?: string,
		page: number = 1,
		limit: number = 10,
		sortBy?: string
	) {
		const [data, totalItems] = await Promise.all([
			ScheduleRepository.getSchedules(
				studioName,
				cinemaName,
				search,
				date,
				page,
				limit,
				sortBy
			),
			ScheduleRepository.countSchedules(
				studioName,
				cinemaName,
				search,
				date
			),
		]);

		const totalPages = Math.ceil(totalItems / limit);

		return {
			data,
			metadata: {
				page,
				limit,
				totalItems,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		};
	}
}

export default ScheduleService;
