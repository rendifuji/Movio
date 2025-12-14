import { release } from "os";
import { z } from "zod";

const movieStatus = z.enum(["NOW_SHOWING", "COMING_SOON"], {
    message: "Status must be either 'NOW_SHOWING' or 'COMING_SOON'",
});

const movieGenre = z.enum(["ACTION", "COMEDY", "DRAMA", "HORROR", "ROMANCE", "SCI_FI", "THRILLER", "ANIMATION", "FANTASY", "DOCUMENTARY"], {
	message: "Genre must be one of the predefined genres",
});
  
export const createMovieSchema = z.object({
	title: z
		.string({ message: "Title must be a string" })
		.min(1, "Title is required")
		.min(2, "Title must be at least 2 characters")
		.max(100, "Title must be at most 100 characters"),
	description: z
		.string({ message: "Description must be a string" })
		.min(1, "Description is required")
		.min(10, "Description must be at least 10 characters")
		.max(1000, "Description must be at most 1000 characters"),
	releaseDate: z
		.string({ message: "Release date must be a string" })
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Release date must be a valid date",
		})
		.min(1, "Release date is required"),
	durationMinutes: z
		.number({ message: "Duration must be a number" })
		.min(1, "Duration is required"),
	genre: movieGenre,
	posterUrl: z
		.string({ message: "Poster URL must be a string" })
		.min(1, "Poster URL is required"),
	rating: z
		.string({ message: "Rating must be a string" })
		.min(1, "Rating is required"),
	status: movieStatus,
});

export const updateMovieSchema = z.object({
	title: z
		.string({ message: "Title must be a string" })
		.min(1, "Title is required")
		.min(2, "Title must be at least 2 characters")
		.max(100, "Title must be at most 100 characters")
		.optional(),
	description: z
		.string({ message: "Description must be a string" })
		.min(1, "Description is required")
		.min(10, "Description must be at least 10 characters")
		.max(1000, "Description must be at most 1000 characters")
		.optional(),
	releaseDate: z
		.string({ message: "Release date must be a string" })
		.optional()
		.refine((val) => val == null || !isNaN(Date.parse(val)), {
			message: "Release date must be a valid date",
		}),
	durationMinutes: z
		.number({ message: "Duration must be a number" })
		.min(1, "Duration is required")
		.optional(),
	genre: movieGenre.optional(),
	posterUrl: z
		.string({ message: "Poster URL must be a string" })
		.min(1, "Poster URL is required")
		.optional(),
	rating: z
		.string({ message: "Rating must be a string" })
		.min(1, "Rating is required")
		.optional(),
	status: movieStatus.optional(),
});
