import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { User, Role } from '../types';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role | null;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const refreshProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('dayflow_access_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const { data } = await api.get('/auth/me');
      setUser(data.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('dayflow_access_token');
      localStorage.removeItem('dayflow_refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    const handleAuthExpired = () => {
      setUser(null);
      error('Session Expired', 'Please sign in to continue.');
    };

    window.addEventListener('dayflow_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('dayflow_auth_expired', handleAuthExpired);
  }, [refreshProfile, error]);

  const login = async (identifier: string, pass: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/login', {
        identifier,
        password: pass,
      });

      const { user: loggedInUser, tokens } = data.data;
      localStorage.setItem('dayflow_access_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('dayflow_refresh_token', tokens.refreshToken);
      }

      setUser(loggedInUser);
      success(`Welcome back, ${loggedInUser.profile?.firstName || 'User'}`);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Invalid credentials';
      error('Authentication Error', msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/register', formData);

      const { user: newUser, tokens } = data.data;
      localStorage.setItem('dayflow_access_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('dayflow_refresh_token', tokens.refreshToken);
      }

      setUser(newUser);
      success('Account Created', `Welcome to Dayflow, ${newUser.profile?.firstName}!`);
    } catch (err: any) {
      const details = err.response?.data?.error?.details;
      const detailMsg = Array.isArray(details) ? details.map((d: any) => d.message).join(', ') : null;
      const msg = detailMsg || err.response?.data?.error?.message || 'Registration failed';
      error('Registration Error', msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('dayflow_refresh_token');
      await api.post('/auth/logout', { refreshToken: token });
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('dayflow_access_token');
      localStorage.removeItem('dayflow_refresh_token');
      setUser(null);
      success('Signed Out', 'You have been safely signed out.');
    }
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        register,
        logout,
        refreshProfile,
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
