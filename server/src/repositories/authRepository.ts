import { prisma } from "../lib/prisma.js";
import { UserRole } from "@prisma/client";

class AuthRepository {
	static async findUserByEmail(email: string) {
		return await prisma.user.findUnique({
			where: { email },
		});
	}

	static async findUserByEmailAndRole(email: string, role: UserRole) {
		return await prisma.user.findFirst({
			where: {
				email,
				role,
			},
		});
	}

	static async createUser(data: {
		email: string;
		name: string;
		role: UserRole;
		password: string;
	}) {
		return await prisma.user.create({
			data: {
				...data,
				password: data.password ?? undefined,
			},
		});
	}
}

export default AuthRepository;
