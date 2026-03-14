import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuth: AuthContextType = {
  isLoggedIn: false,
  login: async () => { throw new Error("Backend ishlamayapti. npm run backend"); },
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const login = async (username: string, password: string) => {
    await apiLogin(username, password);
    setIsLoggedIn(true);
  };

  const logout = () => {
    apiLogout();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
