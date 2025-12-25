import UserService from "../services/userService.js";
import type { Request, Response } from "express";
import { successRes } from "../utils/successResponse.js";
import {
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/errorResponse.js";
import { createUserSchema } from "../validators/userValidation.js";
import { ZodError } from "zod";

class UserController {
	static async createUser(req: Request, res: Response) {
		try {
			const validatedData = createUserSchema.parse(req.body);

			const user = await UserService.createUser(validatedData);

			return successRes(res, user, "User created successfully", 201);
		} catch (error) {
			if (error instanceof ZodError) {
				return errBadRequest(res, "Invalid request data", error);
			}

			if (error instanceof Error && error.message === "Email already in use") {
				return errBadRequest(res, "Email already in use");
			}

			return errInternalServer(res, error);
		}
	}
}

export default UserController;
