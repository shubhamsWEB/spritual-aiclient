import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';

type Currency = 'USD' | 'INR';
type PaymentGateway = 'payu' | 'razorpay';

interface PaymentContextType {
  createOrder: (amount: number, plan: string, currency?: Currency) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  verifyPayment: (paymentId: string, orderId: string, signature: string, currency?: Currency) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  paymentGateway: PaymentGateway | null;
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
  const { isIndia } = useLocation();
  
  // Determine payment gateway based on location
  const paymentGateway: PaymentGateway | null = isIndia === null 
    ? null 
    : isIndia ? 'payu' : 'razorpay';

  const createOrder = async (amount: number, plan: string, currency: Currency = 'INR') => {
    try {
      setIsLoading(true);
      
      // Use the location context to determine payment gateway
      if (paymentGateway === null) {
        return {
          success: false,
          error: 'Location detection is still in progress. Please try again.'
        };
      }
      
      console.log(`Creating order with ${paymentGateway} payment gateway for ${isIndia ? 'Indian' : 'non-Indian'} user`);
      
      const response = await api.post('/api/payment/create-order', {
        amount,
        plan,
        currency,
        userId: user?.id,
        email: user?.email,
        paymentGateway,
        notes: {
          plan,
          name: user?.name,
          email: user?.email,
          amount,
          currency
        }
      });

      if (response.data.success) {
        return {
          success: true,
          orderId: response?.data?.orderId || response?.data?.paymentData?.txnid,
          paymentData: response?.data?.paymentData || response?.data
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
      
      // Use the location context to determine payment gateway
      if (paymentGateway === null) {
        return {
          success: false,
          error: 'Location detection is still in progress. Please try again.'
        };
      }
      
      const response = await api.post('/api/payment/verify', {
        paymentId,
        orderId,
        signature,
        currency,
        userId: user?.id,
        email: user?.email,
        paymentGateway
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

  const value = {
    createOrder,
    verifyPayment,
    isLoading,
    paymentGateway
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