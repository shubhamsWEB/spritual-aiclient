import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#973B00] text-amber-100 p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <Image 
              src={'/logo.svg'} 
              alt="Gita Speaks Logo" 
              width={60} 
              height={60}
              className="mr-3 rounded-full"
            />
            <div>
              <span className="text-lg font-serif logo-font">GITA SPEAKS</span>
              <p className="text-xs opacity-75">
                Wisdom from the sacred Bhagavad Gita teachings
              </p>
            </div>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p className="text-xs opacity-75 mt-1">
              © {new Date().getFullYear()} Spiritual Guidance Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 