import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import API from "./api";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export const register = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await API.post<RegisterResponse>("/user", {
    ...payload,
    role: "USER",
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await API.post("/auth/logout");
};

export const refresh = async (): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/refresh");
  return response.data;
};
