import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Validation
const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	HOST: z.string().min(1).default("localhost"),
	PORT: z.coerce.number().int().positive().default(8000),
	CORS_ORIGIN: z.url().min(1),
	DATABASE_URL: z.url().min(1),
	ACCESS_TOKEN_SECRET: z.string().min(1),
	REFRESH_TOKEN_SECRET: z.string().min(1),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("Invalid environment variables:", parsedEnv.error.message);
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === "development",
	isProduction: parsedEnv.data.NODE_ENV === "production",
};
