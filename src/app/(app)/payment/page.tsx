'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PaymentMethodToggle from '@/components/common/PaymentMethodToggle';
import { usePaymentMethod } from '@/contexts/PaymentMethodContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

declare global {
  interface Window {
    Razorpay: any;
    paypal: any;
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { paymentMethod } = usePaymentMethod();
  const { createOrder, verifyPayment, createPayPalOrder, capturePayPalOrder, isLoading } = usePayment();
  const { currency, formatPrice } = useCurrency();
  
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);
  const [planDetails, setPlanDetails] = useState<{
    plan: string;
    name: string;
    amount: number;
    description: string;
  } | null>(null);

  // Get plan details from URL params
  useEffect(() => {
    if (!searchParams) return;
    
    const plan = searchParams.get('plan');
    const amount = searchParams.get('amount');
    
    if (!plan || !amount) {
      router.push('/pricing');
      return;
    }

    const planName = plan === 'devotee' ? 'Devotee' : 'Guru';
    const planDescription = plan === 'devotee' 
      ? 'Monthly subscription with unlimited access' 
      : 'Annual subscription with unlimited access and exclusive features';

    setPlanDetails({
      plan,
      name: planName,
      amount: parseFloat(amount),
      description: planDescription
    });
  }, [searchParams, router]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Load payment scripts
  useEffect(() => {
    if (!planDetails) return;

    let razorpayScript: HTMLScriptElement | null = null;
    let paypalScript: HTMLScriptElement | null = null;

    // Only load Razorpay if it's not already loaded
    if (!window.Razorpay && !razorpayScriptLoaded) {
      razorpayScript = document.createElement('script');
      razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      razorpayScript.async = true;
      
      razorpayScript.onload = () => {
        console.log('Razorpay script loaded');
        setRazorpayScriptLoaded(true);
      };
      
      document.body.appendChild(razorpayScript);
    } else {
      setRazorpayScriptLoaded(true);
    }
    
    // Only load PayPal if it's not already loaded
    if (!window.paypal && !paypalScriptLoaded) {
      paypalScript = document.createElement('script');
      paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
      paypalScript.async = true;
      
      paypalScript.onload = () => {
        console.log('PayPal script loaded');
        setPaypalScriptLoaded(true);
      };
      
      document.body.appendChild(paypalScript);
    } else {
      setPaypalScriptLoaded(true);
    }
    
    return () => {
      if (razorpayScript) document.body.removeChild(razorpayScript);
      if (paypalScript) document.body.removeChild(paypalScript);
    };
  }, [planDetails, currency, razorpayScriptLoaded, paypalScriptLoaded]);

  // Render PayPal buttons when script is loaded
  useEffect(() => {
    // Only proceed if PayPal script is loaded, payment method is PayPal, and buttons haven't been rendered yet
    if (paypalScriptLoaded && paymentMethod === 'paypal' && planDetails && !paypalButtonRendered) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      
      // Check if the container exists and paypal object is available
      if (paypalButtonContainer && window.paypal && window.paypal.Buttons) {
        console.log('Rendering PayPal buttons');
        // Clear the container first
        paypalButtonContainer.innerHTML = '';
        
        try {
          window.paypal.Buttons({
            style: {
              color: 'gold',
              shape: 'rect',
              label: 'pay'
            },
            createOrder: async () => {
              try {
                const response = await createPayPalOrder(
                  planDetails.amount,
                  planDetails.plan,
                  currency
                );
                
                if (response.success && response.orderId) {
                  return response.orderId;
                } else {
                  throw new Error(response.error || 'Failed to create PayPal order');
                }
              } catch (error: any) {
                console.error('Error creating PayPal order:', error);
                alert(error.message || 'Error creating PayPal order');
                throw error; // Rethrow to prevent PayPal from proceeding
              }
            },
            onApprove: async (data: any) => {
              try {
                const response = await capturePayPalOrder(data.orderID);
                
                if (response.success) {
                  router.push('/payment/success');
                } else {
                  throw new Error(response.error || 'Failed to capture PayPal payment');
                }
              } catch (error: any) {
                console.error('Error capturing PayPal payment:', error);
                alert(error.message || 'Error capturing PayPal payment');
                router.push('/payment/failed');
              }
            },
            onCancel: () => {
              console.log('PayPal payment cancelled');
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
              alert('Error processing PayPal payment');
            }
          }).render('#paypal-button-container');
          
          setPaypalButtonRendered(true);
        } catch (error) {
          console.error('Error rendering PayPal buttons:', error);
        }
      } else {
        console.warn('PayPal container not found or PayPal object not available');
      }
    }
  }, [paypalScriptLoaded, paymentMethod, planDetails, currency, createPayPalOrder, capturePayPalOrder, router, paypalButtonRendered]);

  // Reset PayPal button rendered state when payment method changes
  useEffect(() => {
    if (paymentMethod !== 'paypal') {
      setPaypalButtonRendered(false);
    }
  }, [paymentMethod]);

  const handleRazorpayPayment = async () => {
    if (!planDetails) return;
    
    try {
      const orderAmount = planDetails.amount * 100;
      const orderResponse = await createOrder(orderAmount, planDetails.plan, currency);
      
      if (!orderResponse.success || !orderResponse.orderId) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: 'GitaSpeaks',
        description: `Payment for ${planDetails.name} plan`,
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
              router.push('/payment/success');
            } else {
              throw new Error(verificationResponse.error || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            alert(error.message || 'Payment verification failed. Please contact support.');
            router.push('/payment/failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#973B00',
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'An error occurred during payment');
    }
  };

  if (!planDetails || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#973B00]"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#973B00] text-white p-6">
          <h1 className="text-2xl font-serif">Complete Your Purchase</h1>
          <p className="opacity-90 mt-1">Secure payment for {planDetails.name} Plan</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Order Summary</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{planDetails.name} Plan</span>
              <span className="font-medium text-amber-700">{formatPrice(planDetails.amount)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-3">{planDetails.description}</div>
            <div className="border-t border-amber-200 pt-2 flex justify-between font-bold">
              <span className="text-gray-600">Total</span>
              <span className="text-amber-700">{formatPrice(planDetails.amount)}</span>
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Select Payment Method</h2>
            <div className="flex justify-center mb-6">
              <PaymentMethodToggle />
            </div>
            
            {/* Payment Buttons */}
            <div className="mt-6">
              {paymentMethod === 'razorpay' ? (
                <button
                  onClick={handleRazorpayPayment}
                  disabled={isLoading || !razorpayScriptLoaded}
                  className={`w-full py-3 px-4 bg-[#973B00] text-white rounded-lg font-medium hover:bg-[#BA4D00] transition-colors flex items-center justify-center gap-3 ${
                    isLoading || !razorpayScriptLoaded ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Pay with Razorpay'}
                  <div className="w-6 h-6 relative">
                    <Image 
                      src="/images/razorpay-logo.png" 
                      alt="Razorpay" 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                </button>
              ) : (
                <div id="paypal-button-container" className="min-h-[45px]">
                  {!paypalScriptLoaded && (
                    <div className="flex justify-center items-center h-[45px] bg-gray-100 rounded-lg">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#973B00]"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Secure Payment Notice */}
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Payment Processing</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 text-center">
          <Link href="/pricing" className="text-[#973B00] hover:text-[#BA4D00] font-medium">
            Return to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
} 