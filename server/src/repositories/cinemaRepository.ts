import { prisma } from "../lib/prisma.js";
import type {
	CreateCinemaRequest,
	UpdateCinemaRequest,
} from "../types/cinemaType.js";

class CinemaRepository {
	static async createCinema(data: CreateCinemaRequest) {
		return await prisma.cinema.create({
			data,
			include: {
				studios: true,
			},
		});
	}

	static async updateCinema(data: UpdateCinemaRequest, cinemaId: string) {
		return await prisma.cinema.update({
			where: { cinemaId },
			data,
			include: {
				studios: true,
			},
		});
	}

	static async getCinemaById(cinemaId: string) {
		return await prisma.cinema.findUnique({
			where: { cinemaId },
			include: {
				studios: true,
			},
		});
	}

	static async deleteCinema(cinemaId: string) {
		return await prisma.cinema.delete({
			where: { cinemaId },
		});
	}

	static async getCinemas(
		search?: string,
		city?: string,
		page: number = 1,
		limit: number = 10,
		sortBy: string = "name-asc"
	) {
		const skip = (page - 1) * limit;

		const where: any = {};

		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		if (city) {
			where.city = {
				contains: city,
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
			case "city-asc":
				orderBy = { city: "asc" };
				break;
			case "city-desc":
				orderBy = { city: "desc" };
				break;
			default:
				orderBy = { name: "asc" };
		}

		return await prisma.cinema.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				studios: true,
			},
		});
	}

	static async countCinemas(search?: string, city?: string) {
		const where: any = {};

		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		if (city) {
			where.city = {
				contains: city,
				mode: "insensitive",
			};
		}

		return await prisma.cinema.count({ where });
	}
}

export default CinemaRepository;
