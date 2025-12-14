import type { Response } from "express";
import { ZodError } from "zod";

export enum ErrorCode {
	BAD_REQUEST = "BAD_REQUEST",
	FORBIDDEN = "FORBIDDEN",
	NOT_FOUND = "NOT_FOUND",
	UNAUTHORIZED = "UNAUTHORIZED",
	INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

const baseError = (
	res: Response,
	status: number,
	code: ErrorCode,
	message: string,
	_details?: any,
	errors?: any[]
) => {
	const response: any = {
		success: false,
		status,
		code,
		message,
    };
    
	if (errors && errors.length > 0) {
		response.errors = [errors[0]];
    }
    
	return res.status(status).json(response);
};

export const errBadRequest = (res: Response, msg: string, error?: any) => {
	let errors;
	if (error instanceof ZodError) {
		errors = error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));
	}

	if (Array.isArray(errors) && errors.length > 1) {
		errors = [errors[0]];
    }
    
	return baseError(res, 400, ErrorCode.BAD_REQUEST, msg, undefined, errors);
};

export const errForbidden = (res: Response, msg?: string) =>
	baseError(res, 403, ErrorCode.FORBIDDEN, msg || "Forbidden");

export const errNotFound = (res: Response, msg: string) =>
	baseError(res, 404, ErrorCode.NOT_FOUND, msg);

export const errUnauthenticated = (res: Response, error?: any) =>
	baseError(res, 401, ErrorCode.UNAUTHORIZED, "Unauthorized", error);

export const errInternalServer = (res: Response, error?: any) => {
	console.error("Internal server error:", error);
	return baseError(
		res,
		500,
		ErrorCode.INTERNAL_SERVER_ERROR,
		error?.message || "Internal server error",
		error
	);
};
