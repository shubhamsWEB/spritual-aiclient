'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from '@/utils/cookies';
// Define types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  profile: {
    full_name: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>;
  register: (email: string, password: string, name?: string) => Promise<{success: boolean, message?: string}>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateUserDetails: (user: User) => Promise<void>;
  loginWithGoogle: (redirectPath?: string) => Promise<{success: boolean, message?: string}>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = getCookie('authToken');
      setIsLoading(true);
      
      if (!token) {
        setIsLoading(false);
        return false;
      }
      
      // Call the backend to validate token and get user info
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsLoading(false);
        return true;
      } else {
        deleteCookie('authToken');
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      deleteCookie('authToken');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{success: boolean, message?: string}> => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        setCookie('authToken', token);
        setUser(user);
        setIsLoading(false);
        window.location.href = '/chat';
        //router.push('/chat');
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: response.data.error?.message || 'Login failed' };
      }
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.error?.message || 'An error occurred during login' 
      };
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string): Promise<{success: boolean, message?: string}> => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/register', { email, password, name });
      
      if (response.data.success) {
        // If email verification is required
        if (response.data.data.confirmed === false) {
          setIsLoading(false);
          return { 
            success: true, 
            message: response.data.data.message || 'Please check your email to confirm your account.'
          };
        }
        
        // If registration is immediate
        const { user, token } = response.data.data;
        setCookie('authToken', token);
        setUser(user);
        setIsLoading(false);
        window.location.href = '/chat';
        //router.push('/chat');
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: response.data.error?.message || 'Registration failed' };
      }
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.error?.message || 'An error occurred during registration' 
      };
    }
  };

// Google login function
const loginWithGoogle = async (redirectPath = '/chat'): Promise<{success: boolean, message?: string}> => {
  try {
    setIsLoading(true);
    
    // Get current URL for redirect
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // First, get the auth URL from the backend
    const response = await axios.get('/api/auth/google', {
      params: { 
        redirect_url: currentOrigin,
        redirect_after: redirectPath // Pass the redirect path to be used after authentication
      }
    });
    
    if (response.data.success && response.data.data.url) {
      // Redirect to Google's OAuth consent screen
      window.location.href = response.data.data.url;
      return { success: true };
    } else {
      setIsLoading(false);
      return { 
        success: false, 
        message: response.data.error?.message || 'Failed to initiate Google login' 
      };
    }
  } catch (error: any) {
    setIsLoading(false);
    return { 
      success: false, 
      message: error.response?.data?.error?.message || 'An error occurred during Google login' 
    };
  }
};

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const authCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      const token = authCookie ? authCookie.split('=')[1] : null;
      
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      setIsLoading(false);
       window.location.href = '/';
    }
  };

  const updateUserDetails = async (user: User) => {
    try {
      setIsLoading(true);
      const authCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      const token = authCookie ? authCookie.split('=')[1] : null;
      const response = await axios.put('/api/auth/profile', user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data.data.user);
      setIsLoading(false);
    } catch (error) {
      console.error('Update user details error:', error);
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    updateUserDetails,
    loginWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}