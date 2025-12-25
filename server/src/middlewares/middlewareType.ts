import type { UserRole } from "@prisma/client";
import type { Request } from "express";

export type UserData = {
	id: string; 
	name: string;
	email: string;
	role: UserRole;
};

export interface ValidationRequest extends Request {
	user?: UserData;
}
