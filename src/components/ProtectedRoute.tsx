import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated, validateToken } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(isAuthenticated);

  useEffect(() => {
    const checkToken = async () => {
      const valid = await validateToken();
      setIsValid(valid);
      setIsValidating(false);
    };
    if (isAuthenticated) {
      checkToken();
    } else {
      setIsValidating(false);
    }
  }, [isAuthenticated, validateToken]);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isValid) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}
