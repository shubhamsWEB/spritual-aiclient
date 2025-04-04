'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/user/UsersProfile';
import Image from 'next/image';

export default function ProfilePage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 animate-pulse">
            <Image
              src="/images/peacock-feather.svg"
              alt="Loading"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-4 text-amber-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-gray-800 mb-6 text-center">
            Your Spiritual Account
          </h1>
          
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/images/peacock-feather.svg"
                alt="Peacock Feather"
                fill
                className="object-contain peacock-feather"
              />
            </div>
          </div>
          
          <UserProfile/>
          
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Your spiritual journey is personal and sacred. 
              We keep your information secure and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}