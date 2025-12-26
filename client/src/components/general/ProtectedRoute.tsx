import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import type { UserRole } from "@/types/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const storedRole = localStorage.getItem("authRole") as UserRole | null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!storedRole || !allowedRoles.includes(storedRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
