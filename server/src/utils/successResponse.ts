import type { Response } from "express";

export const successRes = (
	res: Response,
	data: any,
	msg: string,
	status: number = 200
) => {
	return res.status(status).json({
		status,
		success: true,
		message: msg,
		data,
	});
};
