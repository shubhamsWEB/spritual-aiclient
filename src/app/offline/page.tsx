'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8 relative w-32 h-32 mx-auto">
          <Image
            src="/images/peacock-feather.svg"
            alt="Peacock Feather"
            fill
            className="object-contain peacock-feather"
          />
        </div>
        
        <h1 className="text-3xl font-serif text-gray-800 mb-4">
          You are currently offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Please check your internet connection and try again to receive divine wisdom from the Bhagavad Gita.
        </p>
        
        <Link href="/">
          <button className="bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-8 rounded-full transition-colors">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
} 