import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "@/services/apiService";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface JwtPayload {
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
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId")
      ? parseInt(localStorage.getItem("userId")!, 10)
      : null
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
      const decoded: JwtPayload = jwtDecode(accessToken);
      const decodedUserId = decoded.userId;
      if (!decodedUserId) {
        throw new Error("User ID not found in token");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", decodedUserId.toString());
      localStorage.setItem("userName", user.name || "Nome do cliente");

      // Apenas marque se tem imagem, não armazene a imagem
      localStorage.setItem(
        "hasBannerImage",
        user.pathImageBanner ? "true" : "false"
      );

      setIsAuthenticated(true);
      setUserId(decodedUserId);
      setAuthToken(accessToken);
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Executing logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userBannerImage");
    setIsAuthenticated(false);
    setUserId(null);
    setAuthToken(null);
  };

  const checkTokenValidity = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsAuthenticated(false);
      setUserId(null);
      return false;
    }

    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log("Token expired, logging out");
        logout();
        return false;
      }
      setIsAuthenticated(true);
      setUserId(decoded.userId);
      setAuthToken(accessToken);
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
