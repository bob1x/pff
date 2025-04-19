import React, { createContext, useState, ReactNode } from "react";
import authApi, { AuthUser } from "../../apis/authApi";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authApi.login({ email, password });
      setUser(user);
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
      const { user } = await authApi.signup(data);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}