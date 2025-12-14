import { prisma } from "../lib/prisma.js";
import { UserRole } from "@prisma/client";
import type { CreateUser } from "../types/userType.js";

class UserRepository {
    static async createUser(data: CreateUser) {
        return await prisma.user.create({ data });
    }

    static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email } });
    }
    
}

export default UserRepository;