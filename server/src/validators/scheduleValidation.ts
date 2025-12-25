import { z } from "zod";

export const createScheduleSchema = z.object({
	movieId: z
		.string({ message: "Movie ID must be a string" })
		.min(1, "Movie ID is required")
		.uuid("Movie ID must be a valid UUID"),
	cinemaId: z
		.string({ message: "Cinema ID must be a string" })
		.min(1, "Cinema ID is required")
		.uuid("Cinema ID must be a valid UUID"),
	studioId: z
		.string({ message: "Studio ID must be a string" })
		.min(1, "Studio ID is required")
		.uuid("Studio ID must be a valid UUID"),
	date: z
		.string({ message: "Date must be a string" })
		.min(1, "Date is required")
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Date must be a valid date format",
		}),
	startTime: z
		.string({ message: "Start time must be a string" })
		.min(1, "Start time is required")
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Start time must be a valid datetime format",
		}),
	price: z
		.number({ message: "Price must be a number" })
		.min(0, "Price must be at least 0"),
});

export const updateScheduleSchema = z.object({
	movieId: z
		.string({ message: "Movie ID must be a string" })
		.uuid("Movie ID must be a valid UUID")
		.optional(),
	cinemaId: z
		.string({ message: "Cinema ID must be a string" })
		.uuid("Cinema ID must be a valid UUID")
		.optional(),
	studioId: z
		.string({ message: "Studio ID must be a string" })
		.uuid("Studio ID must be a valid UUID")
		.optional(),
	date: z
		.string({ message: "Date must be a string" })
		.optional()
		.refine((val) => val == null || !isNaN(Date.parse(val)), {
			message: "Date must be a valid date format",
		}),
	startTime: z
		.string({ message: "Start time must be a string" })
		.optional()
		.refine((val) => val == null || !isNaN(Date.parse(val)), {
			message: "Start time must be a valid datetime format",
		}),
	price: z
		.number({ message: "Price must be a number" })
		.min(0, "Price must be at least 0")
		.optional(),
});
