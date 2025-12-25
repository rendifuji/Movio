import { prisma } from "../lib/prisma.js";
import type {
	CreateStudioRequest,
	UpdateStudioRequest,
} from "../types/studioType.js";

class StudioRepository {
	static async createStudio(data: CreateStudioRequest) {
		return await prisma.studio.create({
			data,
			include: {
				cinema: true,
			},
		});
	}

	static async updateStudio(data: UpdateStudioRequest, studioId: string) {
		return await prisma.studio.update({
			where: { studioId },
			data,
			include: {
				cinema: true,
			},
		});
	}

	static async getStudioById(studioId: string) {
		return await prisma.studio.findUnique({
			where: { studioId },
			include: {
				cinema: true,
			},
		});
	}

	static async deleteStudio(studioId: string) {
		return await prisma.studio.delete({
			where: { studioId },
		});
	}

	static async getStudios(
		cinemaId?: string,
		search?: string,
		page: number = 1,
		limit: number = 10,
		sortBy: string = "name-asc"
	) {
		const skip = (page - 1) * limit;

		const where: any = {};

		if (cinemaId) {
			where.cinemaId = cinemaId;
		}

		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		let orderBy: any = { name: "asc" };

		const normalizedSort = (sortBy ?? "name-asc")
			.toString()
			.trim()
			.toLowerCase();
		switch (normalizedSort) {
			case "name-asc":
				orderBy = { name: "asc" };
				break;
			case "name-desc":
				orderBy = { name: "desc" };
				break;
			case "capacity-asc":
				orderBy = { capacity: "asc" };
				break;
			case "capacity-desc":
				orderBy = { capacity: "desc" };
				break;
			default:
				orderBy = { name: "asc" };
		}

		return await prisma.studio.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				cinema: true,
			},
		});
	}

	static async countStudios(cinemaId?: string, search?: string) {
		const where: any = {};

		if (cinemaId) {
			where.cinemaId = cinemaId;
		}

		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		return await prisma.studio.count({ where });
	}

	static async checkCinemaExists(cinemaId: string) {
		return await prisma.cinema.findUnique({
			where: { cinemaId },
		});
	}
}

export default StudioRepository;
