import AuthService from "../services/authService.js";
import type { Request, Response } from "express";
import { successRes } from "../utils/successResponse.js";
import {
	errInternalServer,
	errUnauthenticated,
	errBadRequest,
} from "../utils/errorResponse.js";
import { z } from "zod";
import { loginSchema } from "../validators/authValidation.js";

class AuthController {
	static async login(req: Request, res: Response) {
		try {
			const validatedData = loginSchema.parse(req.body);
			const { email, password } = validatedData;

			const result = await AuthService.handleLogin(email, password, res);

			return successRes(res, result, "Login successful");
		} catch (error) {
			if (error instanceof z.ZodError) {
				return errBadRequest(res, "Validation failed", error);
			}

			if (error instanceof Error) {
				if (error.message === "Password is incorrect") {
					return errUnauthenticated(res, "Incorrect password");
				}

				if (error.message === "Email not found") {
					return errUnauthenticated(res, "Email not found");
				}
			}

			return errUnauthenticated(res, error);
		}
	}

	static async refresh(req: Request, res: Response) {
		try {
			if (!req.cookies) {
				return errUnauthenticated(res, "Cookie not found");
			}

			const result = await AuthService.handleRefreshToken(req, res);

			return successRes(res, result, "Token refreshed successfully");
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Refresh token not found") {
					return errUnauthenticated(res, "Refresh token not found");
				}

				if (error.message === "Refresh token is invalid") {
					return errUnauthenticated(res, "Refresh token is invalid or expired");
				}
			}

			return errUnauthenticated(res, "Error occurred while refreshing token");
		}
	}

	static logout(req: Request, res: Response) {
		try {
			AuthService.handleLogout(req, res);

			return successRes(res, null, "Logout successful");
		} catch (error) {
			return errInternalServer(res, error);
		}
	}

	static googleAuth(req: Request, res: Response) {
		try {
			const authUrl = AuthService.getGoogleAuthUrl();
			return res.redirect(authUrl);
		} catch (error) {
			return errInternalServer(res, error);
		}
	}

	static async googleCallback(req: Request, res: Response) {
		try {
			console.log("🔵 [GoogleCallback] Starting callback handler");
			console.log("🔵 [GoogleCallback] Query params:", req.query);

			const { code } = req.query;

			if (!code || typeof code !== "string") {
				console.log("❌ [GoogleCallback] No authorization code found");
				return errBadRequest(res, "Authorization code is required");
			}

			console.log("✅ [GoogleCallback] Code received, processing...");
			const result = await AuthService.handleGoogleCallback(code, res);
			console.log("✅ [GoogleCallback] Success! Result:", result);

			return successRes(res, result, "Google login successful");
		} catch (error) {
			console.error("❌ [GoogleCallback] Error caught:", error);

			if (error instanceof Error) {
				console.error("❌ [GoogleCallback] Error message:", error.message);
				console.error("❌ [GoogleCallback] Error stack:", error.stack);

				if (error.message === "Google OAuth authentication failed") {
					return errUnauthenticated(res, "Google authentication failed");
				}
				if (error.message === "Failed to get user email from Google") {
					return errBadRequest(
						res,
						"Unable to get user information from Google"
					);
				}
			}

			return errInternalServer(res, error);
		}
	}
}

export default AuthController;
