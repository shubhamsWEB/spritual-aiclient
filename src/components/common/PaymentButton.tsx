import React, { useEffect, useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useRouter } from 'next/navigation';
import Modal from '../ui/Modal';
import { createPortal } from 'react-dom';

interface PaymentButtonProps {
  amount: number;
  plan: string;
  buttonText: string;
  className?: string;
  currency?: 'USD' | 'INR';
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({ amount, plan, buttonText, className, currency = 'INR' }: PaymentButtonProps) {
  const { createOrder, verifyPayment, isLoading, paymentGateway } = usePayment();
  const { isAuthenticated, user } = useAuth();
  const { isIndia, isLoading: isLocationLoading } = useLocation();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load Razorpay script if the user is not from India
    if (isIndia === false) {
      loadRazorpayScript();
    } else if (isIndia === true) {
      // For PayU, we don't need to load any script in advance
      setScriptLoaded(true);
    }
    
    return () => {
      setMounted(false);
    };
  }, [isIndia]);
  
  const loadRazorpayScript = () => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('Razorpay script loaded');
      setScriptLoaded(true);
      setScriptError(false);
    };
    
    script.onerror = (error) => {
      setScriptError(true);
      console.error('Failed to load Razorpay script:', error);
    };

    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.subscription?.hasActiveSubscription) {
      setShowModal(true);
      return;
    }

    if (!scriptLoaded) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    if (scriptError) {
      alert('There was an error loading the payment system. Please try again later.');
      return;
    }

    try {
      const orderAmount = amount * 100;
      
      console.log(`Using ${paymentGateway} payment gateway for ${isIndia ? 'Indian' : 'non-Indian'} user`);
      
      const orderResponse = await createOrder(orderAmount, plan, currency);
      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      if (isIndia) {
        // Handle PayU payment flow
        await handlePayUPayment(orderResponse);
      } else {
        // Handle Razorpay payment flow
        await handleRazorpayPayment(orderResponse.orderId || '', orderAmount);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'An error occurred during payment');
    }
  };

  const handlePayUPayment = async (orderResponse: any) => {
    try {
      // Check if we have the necessary PayU payment data
      if (!orderResponse.paymentData) {
        throw new Error('PayU payment data is missing from the response');
      }
      
      console.log('PayU payment data:', orderResponse.paymentData);
      
      // Create a form to submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment'; // Production URL
      
      // Add input fields
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      // Add all fields from the payment data
      const paymentData = orderResponse.paymentData;
      Object.entries(paymentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          addField(key, value as string);
        }
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('PayU payment error:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (orderId: string, orderAmount: number) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderAmount,
      currency: currency,
      name: 'GitaSpeaks',
      description: `Payment for ${plan} plan`,
      order_id: orderId,
      handler: async function (response: any) {
        try {
          const verificationResponse = await verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            currency
          );

          if (verificationResponse.success) {
            router.push('/chat');
          } else {
            throw new Error(verificationResponse.error || 'Payment verification failed');
          }
        } catch (error: any) {
          console.error('Payment verification error:', error);
          alert(error.message || 'Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: user?.name || (user?.profile && user?.profile.length > 0 ? user.profile[0].full_name : undefined),
        email: user?.email,
      },
      theme: {
        color: '#973B00',
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      },
      config: {
        display: {
          blocks: {
            banks: {
              name: currency === 'INR' ? "Pay using UPI" : "Pay using Card",
              instruments: currency === 'INR' ? [
                {
                  method: "upi",
                  flows: ["collect"]
                }
              ] : undefined
            }
          }
        }
      }
    };

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Running in development mode');
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const modalContent = (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title="Active Subscription"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
          <svg className="h-6 w-6 text-[#973B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-700 mb-4">
          You already have an active {user?.subscription?.plan === 'devotee' ? 'Devotee' : 'Guru'} subscription.
          You can manage your subscription from your profile page.
        </p>
        <button
          onClick={() => {
            setShowModal(false);
            router.push('/profile');
          }}
          className="text-[#973B00] hover:text-[#BA4D00] font-medium"
        >
          Go to Profile
        </button>
      </div>
    </Modal>
  );

  // Determine if button should be disabled
  const isButtonDisabled = isLoading || isLocationLoading || !scriptLoaded || isIndia === null;

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className={`${className} ${
          isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing...' : 
         isLocationLoading || isIndia === null ? 'Loading...' : 
         buttonText}
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
} 