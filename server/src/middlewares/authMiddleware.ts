import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type {
	ValidationRequest,
	UserData,
} from "../middlewares/middlewareType.js";
import { errUnauthenticated, errForbidden } from "../utils/errorResponse.js";
import { env } from "../lib/env.js";

class AuthMiddleware {
	static authenticateToken(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization?.replace("Bearer ", "");

			if (!token) {
				return errUnauthenticated(res, "No token provided");
			}

			const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as UserData;

			if (!decoded || typeof decoded === "string" || !decoded.id) {
				return errUnauthenticated(res, "Invalid token");
			}

			const userData: UserData = {
				id: decoded.id,
				name: decoded.name,
				email: decoded.email,
				role: decoded.role,
			};

			(req as ValidationRequest).user = userData;
			next();
		} catch (err) {
			return errUnauthenticated(res, "Invalid token");
		}
	}

	static adminOnly(req: Request, res: Response, next: NextFunction) {
		const validationReq = req as ValidationRequest;
		if (validationReq.user?.role !== "ADMIN") {
			return errForbidden(res, "Admin access required");
		}
		next();
	}

	static userOnly(req: Request, res: Response, next: NextFunction) {
		const validationReq = req as ValidationRequest;
		if (validationReq.user?.role !== "USER") {
			return errForbidden(res, "User access required");
		}
		next();
	}
}

export default AuthMiddleware;
