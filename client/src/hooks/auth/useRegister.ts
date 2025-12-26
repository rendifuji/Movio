import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { register } from "@/services/auth";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

export const useRegister = () => {
  const navigate = useNavigate();
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: (payload) => register(payload),
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isRegistering: mutation.isPending,
    error: mutation.error,
  };
};
