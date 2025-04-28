'use client';

import React from 'react';
import { usePaymentMethod } from '@/contexts/PaymentMethodContext';
import Image from 'next/image';

export default function PaymentMethodToggle() {
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-amber-100">
      <button
        onClick={() => setPaymentMethod('razorpay')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          paymentMethod === 'razorpay'
            ? 'bg-[#973B00] text-white'
            : 'text-[#973B00] hover:bg-amber-50'
        }`}
      >
        <div className="w-6 h-6 relative">
          <Image 
            src="/images/razorpay-logo.png" 
            alt="Razorpay" 
            fill 
            className="object-contain" 
          />
        </div>
        <span className="font-medium">Razorpay</span>
      </button>
      <button
        onClick={() => setPaymentMethod('paypal')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          paymentMethod === 'paypal'
            ? 'bg-[#973B00] text-white'
            : 'text-[#973B00] hover:bg-amber-50'
        }`}
      >
        <div className="w-6 h-6 relative">
          <Image 
            src="/images/paypal-logo.png" 
            alt="PayPal" 
            fill 
            className="object-contain" 
          />
        </div>
        <span className="font-medium">PayPal</span>
      </button>
    </div>
  );
} 