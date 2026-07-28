import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const cached = authService.getCurrentUser();
    if (cached) {
      setUser(cached);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authService.register(name, email, password, phone);
    setUser(res.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
