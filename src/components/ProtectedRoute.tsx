// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // AuthContext's checkTokenValidity runs on mount, so we just wait briefly
    const timer = setTimeout(() => {
      setIsValidating(false);
    }, 100); // Small delay to ensure AuthContext has initialized
    return () => clearTimeout(timer);
  }, []);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}
