"use client";

import apiClient from "@/lib/api-client";
import { AuthService } from "@/services/auth-service";
import { User } from "@/types/api";
import { createContext, useContext, useState, useEffect, ReactNode, Component } from "react";


interface AuthContextType {
  user: User | undefined;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const getMe = async() => {
      const data = await AuthService.getCurrentUser()
      if (data.status === true) {
        setUser(data.user);
      }
    }
    getMe()
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
