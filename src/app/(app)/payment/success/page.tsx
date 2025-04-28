'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to chat page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/chat');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="py-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-center p-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your subscription. You now have access to all features.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/chat" 
            className="block w-full py-3 bg-[#973B00] text-white rounded-lg font-medium hover:bg-[#BA4D00] transition-colors"
          >
            Start Chatting Now
          </Link>
          
          <Link 
            href="/profile" 
            className="block w-full py-3 border border-[#973B00] text-[#973B00] rounded-lg font-medium hover:bg-amber-50 transition-colors"
          >
            View Subscription Details
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          You will be redirected to the chat page in a few seconds...
        </p>
      </div>
    </div>
  );
} 