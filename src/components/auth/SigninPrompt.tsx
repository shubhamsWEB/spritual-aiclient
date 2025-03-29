'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SignInPromptProps {
  message?: string;
}

export default function SignInPrompt({ message }: SignInPromptProps) {
  return (
    <div className="bg-amber-50 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-amber-200 animate-fadeIn">
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <Image
            src="/images/peacock-feather.svg"
            alt="Peacock Feather"
            fill
            className="object-contain peacock-feather"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-serif text-center text-[#973B00] mb-4">
        Continue Your Spiritual Journey
      </h2>
      
      <p className="text-gray-700 text-center mb-6">
        {message || 'Sign in or create an account to receive unlimited divine wisdom from Lord Krishna.'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/auth/login"
          className="bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-2 px-6 rounded-full transition-colors text-center"
        >
          Sign In
        </Link>
        
        <Link
          href="/auth/register"
          className="bg-[#BA4D00] hover:bg-[#973B00] text-white font-medium py-2 px-6 rounded-full transition-colors text-center"
        >
          Create Account
        </Link>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Your spiritual journey is sacred and your information is kept private.
        </p>
      </div>
    </div>
  );
}