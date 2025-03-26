import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import FeatureSection from '@/components/home/FeatureSection';
import ChatNowButton from '@/components/common/ChatNowButton';
export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[280px] h-[400px] md:w-[400px] md:h-[600px]">
              <div className="absolute top-0 left-0 right-0 h-[260px] md:h-[400px]">
                <Image
                  src="/images/krishna-flute.svg"
                  alt="Krishna Playing Flute"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="absolute top-[200px] md:top-[330px] left-0 right-0 h-[180px] md:h-[250px]">
                <Image
                  src="/images/peacock-feather.svg"
                  alt="Peacock Feathers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800">
              Struggling with Life Problems?
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600">
              <q>The Bhagavad Gita Has the Answers</q>
            </h2>
            
            <div className="flex justify-center md:justify-start">
              <ChatNowButton />
            </div>

            <div className="space-y-3 md:space-y-4 mt-4 md:mt-8">
              <h3 className="text-xl md:text-2xl text-gray-700">
                Seek Wisdom from the AI-Powered Bhagvad Gita
              </h3>
              <p className="text-base md:text-lg text-gray-600 italic">
                Now, with Gita Guide, you can experience that wisdom in a 
                personal, accessible way.
              </p>
              <p className="text-base md:text-lg text-gray-600 italic">
                Ask your questions. Share your challenges.<br className="hidden md:block" />
                Clarity. Purpose. Peace — one message at a time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <HowItWorksSection />
      <FeatureSection />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </div>
  );
} 