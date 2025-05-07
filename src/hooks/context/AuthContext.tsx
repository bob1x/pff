// src/components/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import authApi, { AuthUser } from "../../apis/authApi";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean; // new
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  isHR: boolean;
  isJobSeeker: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // new

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const stored = localStorage.getItem("authUser");
    if (token && stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        // corrupted data; clear it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const {
        access,
        refresh,
        user: u,
      } = await authApi.login({ email, password });
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("authUser", JSON.stringify(u));

      setUser(u);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    try {
      const { access, refresh, user: u } = await authApi.signup(data);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("authUser", JSON.stringify(u));

      setUser(u);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setIsAuthenticated(false);
  };
  const isHR = useMemo(() => Boolean(user && user.role === "hr"), [user]);
  const isJobSeeker = useMemo(
    () => Boolean(user && user.role === "user"),
    [user]
  );
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        signup,
        logout,
        isHR,
        isJobSeeker,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
