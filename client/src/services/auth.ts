import type { LoginRequest, LoginResponse } from "@/types/auth";
import API from "./api";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", payload);
  return response.data;
};
