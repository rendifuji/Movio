import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login } from "@/services/auth";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("authRole", data.user.role);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/");
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoggingIn: mutation.isPending,
    error: mutation.error,
  };
};
