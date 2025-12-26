import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logout } from "@/services/auth";
import { clearAuth } from "@/services/api";

export const useLogout = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      navigate("/login");
    },
    onError: () => {
      clearAuth();
      navigate("/login");
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
};
