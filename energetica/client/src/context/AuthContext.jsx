import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/check', {
                credentials: 'include'
            });
            const data = await response.json();
            setIsAdmin(data.isAuthenticated && data.user?.isAdmin);
        } catch (error) {
            console.log('Admin check error:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                setIsAdmin(data.user?.isAdmin);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Login error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5001/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setIsAdmin(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 