import CinemaRepository from "../repositories/cinemaRepository.js";
import type {
	CreateCinemaRequest,
	UpdateCinemaRequest,
} from "../types/cinemaType.js";

class CinemaService {
	static async createCinema(data: CreateCinemaRequest) {
		return await CinemaRepository.createCinema(data);
	}

	static async updateCinema(data: UpdateCinemaRequest, cinemaId: string) {
		const existingCinema = await CinemaRepository.getCinemaById(cinemaId);
		if (!existingCinema) {
			throw new Error("Cinema not found");
		}

		return await CinemaRepository.updateCinema(data, cinemaId);
	}

	static async deleteCinema(cinemaId: string) {
		const existingCinema = await CinemaRepository.getCinemaById(cinemaId);
		if (!existingCinema) {
			throw new Error("Cinema not found");
		}

		return await CinemaRepository.deleteCinema(cinemaId);
	}

	static async getCinemaById(cinemaId: string) {
		const cinema = await CinemaRepository.getCinemaById(cinemaId);
		if (!cinema) {
			throw new Error("Cinema not found");
		}
		return cinema;
	}

	static async getCinemas(
		search?: string,
		city?: string,
		page: number = 1,
		limit: number = 10,
		sortBy?: string
	) {
		const [data, totalItems] = await Promise.all([
			CinemaRepository.getCinemas(search, city, page, limit, sortBy),
			CinemaRepository.countCinemas(search, city),
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

export default CinemaService;
