'use client';

import React from 'react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-center p-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We were unable to process your payment. Please try again or use a different payment method.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/payment?retry=true" 
            className="block w-full py-3 bg-[#973B00] text-white rounded-lg font-medium hover:bg-[#BA4D00] transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/pricing" 
            className="block w-full py-3 border border-[#973B00] text-[#973B00] rounded-lg font-medium hover:bg-amber-50 transition-colors"
          >
            Back to Pricing
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 rounded-lg text-sm text-gray-600 text-left">
          <p className="font-semibold mb-2">Common reasons for payment failure:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Insufficient funds in your account</li>
            <li>Incorrect payment details</li>
            <li>Transaction declined by your bank</li>
            <li>Network or connectivity issues</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          If you continue to face issues, please contact our support team.
        </p>
      </div>
    </div>
  );
} 