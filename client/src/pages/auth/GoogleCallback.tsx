import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { handleAuthSuccess } from "@/services/api";
import { refresh } from "@/services/auth";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("status");

    if (status !== "success") {
      navigate("/login?error=google_auth_failed");
      return;
    }

    (async () => {
      try {
        const data = await refresh();
        const token = data.data.accessToken;
        const user = handleAuthSuccess(token);
        navigate(user?.role === "admin" ? "/admin" : "/");
      } catch (err) {
        console.error("Failed to refresh after Google OAuth", err);
        navigate("/login?error=google_auth_failed");
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default GoogleCallback;
