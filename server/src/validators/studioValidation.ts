import { z } from "zod";

export const createStudioSchema = z.object({
	cinemaId: z
		.string({ message: "Cinema ID must be a string" })
		.min(1, "Cinema ID is required")
		.uuid("Cinema ID must be a valid UUID"),
	name: z
		.string({ message: "Name must be a string" })
		.min(1, "Name is required")
		.min(1, "Name must be at least 1 character")
		.max(50, "Name must be at most 50 characters"),
	capacity: z
		.number({ message: "Capacity must be a number" })
		.min(1, "Capacity must be at least 1")
		.optional(),
});

export const updateStudioSchema = z.object({
	cinemaId: z
		.string({ message: "Cinema ID must be a string" })
		.uuid("Cinema ID must be a valid UUID")
		.optional(),
	name: z
		.string({ message: "Name must be a string" })
		.min(1, "Name must be at least 1 character")
		.max(50, "Name must be at most 50 characters")
		.optional(),
	capacity: z
		.number({ message: "Capacity must be a number" })
		.min(1, "Capacity must be at least 1")
		.optional(),
});
