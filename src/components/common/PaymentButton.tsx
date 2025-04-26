import React, { useEffect, useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const { createOrder, verifyPayment, isLoading } = usePayment();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      setScriptLoaded(true);
      setScriptError(false);
    };
    
    script.onerror = (error) => {
      setScriptError(true);
      console.error('Failed to load Razorpay script:', error);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      setMounted(false);
    };
  }, []);

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
      const orderResponse = await createOrder(orderAmount, plan, currency);
      if (!orderResponse.success || !orderResponse.orderId) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: 'GitaSpeaks',
        description: `Payment for ${plan} plan`,
        order_id: orderResponse.orderId,
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
          name: user?.name,
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
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'An error occurred during payment');
    }
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

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoading || !scriptLoaded}
        className={`${className} ${
          isLoading || !scriptLoaded ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
} 