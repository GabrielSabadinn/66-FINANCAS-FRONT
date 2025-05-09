import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Executando logout"); // Depuração
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      await authService.validateToken();
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
