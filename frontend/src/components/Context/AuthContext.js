'use client'

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Connect } from '../Api/Connect';

export const StateContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (value) => {
        await Connect.getToken();
        const response = await Connect.postLogin(value);
        setIsAuthenticated(true);
        return response;
    };

    const logout = async () => {
        const response = await Connect.postLogout();
        setUser(null);
        setIsAuthenticated(false);
        return response;
    };

    const Register = async (value) => {
        await Connect.getToken();
        const response = await Connect.postRegister(value);
        setIsAuthenticated(true);
        return response;
    }

    const checkAuth = useCallback(async () => {
        try {
            const response = await Connect.getUser();
            setUser(response.data);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
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
                setIsAuthenticated
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useAuth = () => useContext(StateContext);
