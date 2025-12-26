import { UserRole } from "@prisma/client";

export type CreateUser = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    picture?: string;
}