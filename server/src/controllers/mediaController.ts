import type { RequestHandler } from "express";
import { MediaService } from "../services/mediaService.js";
import {
	successRes,
	errBadRequest,
	errInternalServer,
	errNotFound,
} from "../utils/index.js";
import { z } from "zod";
import { createPresignedUrlSchema } from "../validators/mediaValidation.js";

export const getPresignedUrl: RequestHandler = async (req, res) => {
	try {
		const validatedData = createPresignedUrlSchema.parse(req.body);

		const result = await MediaService.createPresignedUrl(validatedData);

		return successRes(res, result, "Presigned URL created successfully", 201);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return errBadRequest(res, "Invalid request data", error);
		}

		if (error instanceof Error) {
			return errBadRequest(res, error.message);
		}
		return errInternalServer(
			res,
			"An error occurred while creating presigned URL"
		);
	}
};

export const deleteFile: RequestHandler = async (req, res) => {
	try {
		const { fileKey } = req.params;

		if (!fileKey) {
			return errBadRequest(res, "File key is required");
		}

		const fileExists = await MediaService.fileExists(fileKey);
		if (!fileExists) {
			return errNotFound(res, "File not found in storage");
		}

		const result = await MediaService.deleteFile(fileKey);
		return successRes(res, result, "File deleted successfully", 200);
	} catch (error) {
		if (error instanceof Error) {
			return errBadRequest(res, error.message);
		}
		return errInternalServer(res, "An error occurred while deleting file");
	}
};
