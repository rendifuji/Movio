import { z } from "zod";

const userRole = z.enum(["USER", "ADMIN"], {
	message: "Role must be either 'USER' or 'ADMIN'",
});

export const createUserSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters long")
		.max(100, "Name must not exceed 100 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email format"
		),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long"),
	role: userRole,
});

export const updateUserSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters long")
		.max(100, "Name must not exceed 100 characters")
		.optional(),
	email: z
		.string()
		.min(1, "Email is required")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email format"
		)
		.optional(),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long")
		.optional(),
	role: userRole.optional(),
});
