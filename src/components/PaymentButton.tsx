'use client';

import { useState, useEffect } from 'react';
import { createPaymentOrder, initializePayment, PaymentOptions } from '@/services/payment';
import { useLocation } from '@/contexts/LocationContext';

// Add Razorpay to the Window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
  productName: string;
  description: string;
  email: string;
  contact: string;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
  buttonText?: string;
  buttonClassName?: string;
}

export default function PaymentButton({
  amount,
  productName,
  description,
  email,
  contact,
  onSuccess,
  onFailure,
  buttonText = 'Pay Now',
  buttonClassName = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md py-2 px-4',
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isIndia, isLoading: isLocationLoading } = useLocation();

  // Preload Razorpay script if user is not from India
  useEffect(() => {
    if (isIndia === false) {
      loadRazorpayScript();
    }
  }, [isIndia]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Check if location is still loading
      if (isLocationLoading || isIndia === null) {
        throw new Error('Still detecting your location. Please try again in a moment.');
      }
      
      const gateway = isIndia ? 'PayU (India)' : 'Razorpay';

      // Create a payment order from the server
      const orderResponse = await createPaymentOrder(amount, 'INR', isIndia);
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create payment order');
      }

      // Load Razorpay script if needed (only for non-Indian users)
      if (!isIndia && !window.Razorpay) {
        await loadRazorpayScript();
      }

      // Initialize payment
      const paymentOptions: PaymentOptions = {
        amount: amount,
        currency: 'INR',
        name: productName,
        description,
        orderId: orderResponse.id,
        email,
        contact,
        isIndia, // Pass the location information
        successCallback: (paymentId, orderId, signature) => {
          if (onSuccess) {
            onSuccess({ paymentId, orderId, signature });
          }
        },
        failureCallback: (error) => {
          if (onFailure) {
            onFailure(error);
          }
        },
      };

      await initializePayment(paymentOptions);
    } catch (error) {
      console.error('Error initiating payment:', error);
      if (onFailure) {
        onFailure(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Razorpay SDK failed to load');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || isLocationLoading || isIndia === null}
      className={`${buttonClassName} ${(loading || isLocationLoading || isIndia === null) ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : isLocationLoading ? (
        "Detecting location..."
      ) : (
        buttonText
      )}
    </button>
  );
} 