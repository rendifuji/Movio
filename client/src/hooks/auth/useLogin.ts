import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login } from "@/services/auth";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import { handleAuthSuccess } from "@/services/api";

export const useLogin = () => {
  const navigate = useNavigate();
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      const user = handleAuthSuccess(data.data.accessToken);
      if (user) {
        navigate(user.role === "admin" ? "/admin" : "/");
      }
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoggingIn: mutation.isPending,
    error: mutation.error,
  };
};
