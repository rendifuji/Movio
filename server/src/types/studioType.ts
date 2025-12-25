export type CreateStudioRequest = {
	cinemaId: string;
	name: string;
	capacity?: number;
};

export type UpdateStudioRequest = {
	cinemaId?: string;
	name?: string;
	capacity?: number;
};
