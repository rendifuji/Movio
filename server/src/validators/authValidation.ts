import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email wajib diisi")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Format email tidak valid"
		),
	password: z
		.string()
		.min(1, "Password wajib diisi")
		.min(6, "Password minimal 6 karakter")
		.max(100, "Password maksimal 100 karakter"),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token wajib ada"),
});
