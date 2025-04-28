'use client';

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

type Currency = 'USD' | 'INR';

interface PaymentContextType {
  createOrder: (amount: number, plan: string, currency?: Currency) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  verifyPayment: (paymentId: string, orderId: string, signature: string, currency?: Currency) => Promise<{ success: boolean; error?: string }>;
  createPayPalOrder: (amount: number, plan: string, currency?: Currency) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  capturePayPalOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createOrder = async (amount: number, plan: string, currency: Currency = 'INR') => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/payment/create-order', {
        amount,
        plan,
        currency,
        userId: user?.id,
        email: user?.email,
        notes: {
          plan,
          name: user?.name,
          email: user?.email,
          amount,
          currency
        }
      });
      console.log("🚀 ~ createOrder ~ response:", response);

      if (response.data.success) {
        return {
          success: true,
          orderId: response.data.orderId
        };
      } else {
        return {
          success: false,
          error: response.data.error?.message || 'Failed to create order'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'An error occurred while creating order'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentId: string, orderId: string, signature: string, currency: Currency = 'INR') => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/payment/verify', {
        paymentId,
        orderId,
        signature,
        currency,
        userId: user?.id,
        email: user?.email
      });

      if (response.data.success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.data.error?.message || 'Payment verification failed'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'An error occurred while verifying payment'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const createPayPalOrder = async (amount: number, plan: string, currency: Currency = 'USD') => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/paypal/create-order', {
        amount,
        plan,
        currency,
        userId: user?.id,
        email: user?.email
      });

      if (response.data.success) {
        return {
          success: true,
          orderId: response.data.orderId
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to create PayPal order'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred while creating PayPal order'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const capturePayPalOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/api/paypal/capture/${orderId}`, {
        userId: user?.id,
        email: user?.email
      });

      if (response.data.success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'PayPal payment capture failed'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred while capturing PayPal payment'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    createOrder,
    verifyPayment,
    createPayPalOrder,
    capturePayPalOrder,
    isLoading
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 