import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gita-bg.jpg"
          alt="Bhagavad Gita Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-purple-900/60" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Divine Wisdom from the Bhagavad Gita
            </h1>
            <p className="text-lg mb-8 text-amber-100">
              Seek guidance from the timeless teachings of Lord Krishna. 
              Ask questions about dharma, karma, purpose, meditation, 
              and the path to spiritual fulfillment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/chat">
                <Button size="lg">
                  Begin Your Spiritual Journey
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative h-[500px] w-full">
            <Image
              src="/images/krishna.jpg"
              alt="Lord Krishna"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 