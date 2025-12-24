export type CreateScheduleRequest = {
	movieId: string;
	cinemaId: string;
	studioId: string;
	date: string;
	startTime: string;
	price: number;
};

export type UpdateScheduleRequest = {
	movieId?: string;
	cinemaId?: string;
	studioId?: string;
	date?: string;
	startTime?: string;
	price?: number;
};
