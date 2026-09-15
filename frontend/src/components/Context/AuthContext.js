"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Connect_Auth } from "../Api/auth/Connect_Auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const StateContext = createContext();

export function AuthProvider({ children }) {
  const route = useRouter();

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (
        !cancelled &&
        localStorage.getItem("AUTHENTICATED") === "true"
      ) {
        setIsAuthenticated(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const StorAuth = (value) => {
    setIsAuthenticated(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("AUTHENTICATED", value ? "true" : "false");
    }
  };

  const login = async (value) => {
    try {
      const response = await Connect_Auth.postLogin(value);
      SetToken(response.data.token);
      StorAuth(true);
      return response;
    } catch (error) {
      StorAuth(false);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = async () => {
    StorAuth(false);
    setUser(null);
    route.push("/login");
    try {
      await Connect_Auth.postLogout();
      toast.success("Logged out successfully.");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await Connect_Auth.getUser();
      setUser(response.data);
      StorAuth(true);
      return response.data;
    } catch (error) {
      setUser(null);
      StorAuth(false);
      throw error;
    }
  }, []);

  const SetToken = (token) => {
    if (token) {
      localStorage.setItem("access_token", token);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        checkAuth,
        isAuthenticated,
        setIsAuthenticated,
        StorAuth,
        SetToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useAuth = () => useContext(StateContext);
