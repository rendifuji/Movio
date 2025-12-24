export type CreateCinemaRequest = {
	name: string;
	city: string;
};

export type UpdateCinemaRequest = {
	name?: string;
	city?: string;
};
