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
    try {
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
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Executando logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      await authService.validateToken();
      // Ensure userId is in localStorage after validation
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && !localStorage.getItem("userId")) {
        const decoded: JwtPayload = jwtDecode(accessToken);
        localStorage.setItem("userId", decoded.userId.toString());
      }
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
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
