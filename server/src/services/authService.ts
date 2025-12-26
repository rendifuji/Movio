import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { TokenPayload } from "../types/authType.js";
import { env } from "../lib/env.js";
import { getGoogleAuthUrl, getGoogleUserInfo } from "../lib/googleAuth.js";
import { UserRole } from "@prisma/client";
import UserRepository from "../repositories/userRepository.js";

class AuthService {
	private static generateTokens(payload: TokenPayload, res: Response) {
		const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
			expiresIn: "1d",
		});

		const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: env.isProduction ? "none" : "lax",
			secure: env.isProduction,
			maxAge: 24 * 60 * 60 * 1000,
		});

		return {
			accessToken,
		};
	}

	static async handleLogin(email: string, password: string, res: Response) {
		const user = await UserRepository.getUserByEmail(email);

		if (!user) {
			throw new Error("Email not found");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new Error("Password is incorrect");
		}

		const payload: TokenPayload = {
			id: user.userId,
			name: user.name,
			email: user.email,
			role: user.role,
			picture: user.picture || undefined,
		};

		return this.generateTokens(payload, res);
	}

	static async handleRefreshToken(req: Request, res: Response) {
		const cookies = req.cookies;

		if (!cookies?.jwt) {
			throw new Error("Refresh token not found");
		}

		const refreshToken = cookies.jwt;

		try {
			const decoded = jwt.verify(
				refreshToken,
				env.REFRESH_TOKEN_SECRET
			) as TokenPayload;

			const payload: TokenPayload = {
				id: decoded.id,
				name: decoded.name,
				email: decoded.email,
				role: decoded.role,
				picture: decoded.picture,
			};

			const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
				expiresIn: "1h",
			});

			return {
				accessToken,
			};
		} catch (err) {
			res.clearCookie("jwt");
			throw new Error("Refresh token is invalid");
		}
	}

	static handleLogout(req: Request, res: Response) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: env.isProduction ? "none" : "lax",
			secure: env.isProduction,
		});
	}

	static getGoogleAuthUrl() {
		return getGoogleAuthUrl();
	}

	static async handleGoogleCallback(code: string, res: Response) {
		try {
			const googleUser = await getGoogleUserInfo(code);

			if (!googleUser.email) {
				throw new Error("Failed to get user email from Google");
			}

			let user = await UserRepository.getUserByEmail(googleUser.email);

			if (!user) {
				user = await UserRepository.createUser({
					email: googleUser.email,
					name: googleUser.name || "Google User",
					role: UserRole.USER,
					password: await bcrypt.hash("google-oauth-" + Date.now(), 10),
					picture: googleUser.picture || undefined,
				});
			}

			const payload: TokenPayload = {
				id: user.userId,
				name: user.name,
				email: user.email,
				role: user.role.toLowerCase(),
        picture: user.picture || googleUser.picture || undefined,
			};

			return this.generateTokens(payload, res);
		} catch (error) {
			throw new Error("Google OAuth authentication failed");
		}
	}
}

export default AuthService;
