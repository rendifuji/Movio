import { MovieStatus, MovieGenre } from "@prisma/client";

export type CreateMovieRequest = {
	title: string;
	description: string;
	releaseDate: string;
	durationMinutes: number;
	genre: MovieGenre;
	posterUrl: string;
	rating: string;
	status: MovieStatus;
}

export type UpdateMovieRequest = {
	title?: string;
	description?: string;
	releaseDate?: string;
	durationMinutes?: number;
	genre?: MovieGenre;
	posterUrl?: string;
	rating?: string;
	status?: MovieStatus;
};

