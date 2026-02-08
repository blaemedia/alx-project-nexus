'use client';

import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Lazy initializer reads from localStorage only once
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  });

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
