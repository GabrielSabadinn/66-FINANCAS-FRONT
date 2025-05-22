import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

interface JwtPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );

  const login = async (email: string, password: string) => {
    if (isAuthenticated) {
      console.log("Already authenticated, skipping login");
      return;
    }
    try {
      console.log("Initiating login for:", email);
      const { accessToken, refreshToken, user } = await authService.login({
        email,
        password,
      });
      // Decode JWT to get userId
      const decoded: JwtPayload = jwtDecode(accessToken);
      const userId = decoded.userId;
      if (!userId) {
        throw new Error("User ID not found in token");
      }

      // Store tokens and userId
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId.toString());
      setIsAuthenticated(true);
      console.log("Login successful, userId:", userId);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = () => {
    console.log("Executing logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      console.log("Validating token...");
      await authService.validateToken();
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && !localStorage.getItem("userId")) {
        const decoded: JwtPayload = jwtDecode(accessToken);
        localStorage.setItem("userId", decoded.userId.toString());
        console.log("Restored userId:", decoded.userId);
      }
      setIsAuthenticated(true);
      console.log("Token validation successful");
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isAuthenticated) {
      console.log("Found accessToken, validating...");
      validateToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
