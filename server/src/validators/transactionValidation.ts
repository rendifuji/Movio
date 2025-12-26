import { z } from "zod";

export const createCheckoutSchema = z.object({
	scheduleId: z
		.string({ message: "Schedule ID must be a string" })
		.min(1, "Schedule ID is required")
		.uuid("Schedule ID must be a valid UUID"),
	seatLabels: z
		.array(
			z
				.string({ message: "Seat label must be a string" })
				.min(1, "Seat label cannot be empty")
		)
		.min(1, "At least one seat must be selected"),
});

export const ticketIdSchema = z.object({
	ticketId: z
		.string({ message: "Ticket ID must be a string" })
		.min(1, "Ticket ID is required")
		.uuid("Ticket ID must be a valid UUID"),
});
