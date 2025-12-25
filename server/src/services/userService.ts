import UserRepository from "../repositories/userRepository.js";
import type { CreateUser } from "../types/userType.js";
import bcrypt from "bcrypt";

class UserService {
	static async createUser(data: CreateUser) {
		const existingUser = await UserRepository.getUserByEmail(data.email);
		if (existingUser) {
			throw new Error("Email already in use");
		}

		const hashedPassword = await bcrypt.hash(data.password, 10);

		const userData = {
			...data,
			password: hashedPassword,
		};

		return await UserRepository.createUser(userData);
	}
}

export default UserService;
