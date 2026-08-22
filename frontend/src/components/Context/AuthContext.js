"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Connect } from "../Api/Connect";
import { useRouter } from "next/navigation";
import {
  clearAuthCookie,
  hasAuthCookie,
  setAuthCookie,
} from "@/lib/api";

export const StateContext = createContext();

export function AuthProvider({ children }) {
  const route = useRouter();

  const [user, setUser] = useState(null);

  // Start false on both server and client, then hydrate from localStorage in an
  // effect to avoid SSR/CSR mismatch. The proxy guard uses the cookie instead.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Deferred to a microtask: keeps SSR/client first paint identical (false)
    // without calling setState synchronously inside the effect body.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (
        !cancelled &&
        hasAuthCookie() &&
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
    const response = await Connect.postLogin(value);
    SetToken(response.data.token);
    StorAuth(true);
    return response;
  };

  const logout = async () => {
    StorAuth(false);
    setUser(null);
    clearAuthCookie();
    route.push("/login");
    try {
      await Connect.postLogout();
    } catch {
      // Token already invalid or server unreachable — local session is cleared anyway.
    }
  };

  const Register = async (value) => {
    const response = await Connect.postRegister(value);
    SetToken(response.data.token);
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
      clearAuthCookie();
      throw error;
    }
  }, []);

  const SetToken = (token) => {
    if (token) {
      localStorage.setItem("access_token", token);
      setAuthCookie(token);
    }
  };

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
        SetToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useAuth = () => useContext(StateContext);
