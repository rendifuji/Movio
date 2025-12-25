import StudioRepository from "../repositories/studioRepository.js";
import type {
	CreateStudioRequest,
	UpdateStudioRequest,
} from "../types/studioType.js";

class StudioService {
	static async createStudio(data: CreateStudioRequest) {
		// Validate cinema exists
		const cinema = await StudioRepository.checkCinemaExists(data.cinemaId);
		if (!cinema) {
			throw new Error("Cinema not found");
		}

		return await StudioRepository.createStudio(data);
	}

	static async updateStudio(data: UpdateStudioRequest, studioId: string) {
		const existingStudio = await StudioRepository.getStudioById(studioId);
		if (!existingStudio) {
			throw new Error("Studio not found");
		}

		// Validate cinema exists if cinemaId is provided
		if (data.cinemaId) {
			const cinema = await StudioRepository.checkCinemaExists(data.cinemaId);
			if (!cinema) {
				throw new Error("Cinema not found");
			}
		}

		return await StudioRepository.updateStudio(data, studioId);
	}

	static async deleteStudio(studioId: string) {
		const existingStudio = await StudioRepository.getStudioById(studioId);
		if (!existingStudio) {
			throw new Error("Studio not found");
		}

		return await StudioRepository.deleteStudio(studioId);
	}

	static async getStudioById(studioId: string) {
		const studio = await StudioRepository.getStudioById(studioId);
		if (!studio) {
			throw new Error("Studio not found");
		}
		return studio;
	}

	static async getStudios(
		cinemaId?: string,
		search?: string,
		page: number = 1,
		limit: number = 10,
		sortBy?: string
	) {
		const [data, totalItems] = await Promise.all([
			StudioRepository.getStudios(cinemaId, search, page, limit, sortBy),
			StudioRepository.countStudios(cinemaId, search),
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

export default StudioService;
