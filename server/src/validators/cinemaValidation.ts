import { z } from "zod";

export const createCinemaSchema = z.object({
	name: z
		.string({ message: "Name must be a string" })
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),
	city: z
		.string({ message: "City must be a string" })
		.min(1, "City is required")
		.min(2, "City must be at least 2 characters")
		.max(100, "City must be at most 100 characters"),
});

export const updateCinemaSchema = z.object({
	name: z
		.string({ message: "Name must be a string" })
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters")
		.optional(),
	city: z
		.string({ message: "City must be a string" })
		.min(2, "City must be at least 2 characters")
		.max(100, "City must be at most 100 characters")
		.optional(),
});
