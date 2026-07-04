"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { Connect } from "../Api/Connect";
import { useRouter } from "next/navigation";

export const StateContext = createContext();

export function AuthProvider({ children }) {
  const route = useRouter();

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("AUTHENTICATED") === "true";
  });

  const StorAuth = (value) => {
    setIsAuthenticated(value);
    localStorage.setItem("AUTHENTICATED", value ? "true" : "false");
  };

  const login = async (value) => {
    await Connect.getToken();
    const response = await Connect.postLogin(value);
    StorAuth(true);
    return response;
  };

  const logout = async () => {
    const response = await Connect.postLogout();
    setUser(null);
    StorAuth(false);
    route.push("/login");
    return response;
  };

  const Register = async (value) => {
    await Connect.getToken();
    const response = await Connect.postRegister(value);
    StorAuth(true);
    return response;
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await Connect.getUser();
      setUser(response.data);
      StorAuth(true);
      return response.data;
    } catch (error) {
      setUser(null);
      StorAuth(false);
      throw error;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        Register,
        checkAuth,
        isAuthenticated,
        setIsAuthenticated,
        StorAuth,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useAuth = () => useContext(StateContext);
