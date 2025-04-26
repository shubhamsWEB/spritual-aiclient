import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
              className="mr-3 rounded-lg"
            />
            <div>
              <span className="text-lg font-serif logo-font">GITA SPEAKS</span>
              <p className="text-xs opacity-75">
                Wisdom from the sacred Bhagavad Gita teachings
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link href="/privacy-policy" className="hover:text-amber-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/faq" className="hover:text-amber-200 transition-colors">
                FAQ
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-amber-200 transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-amber-200 transition-colors">
                Refund Policy
              </Link>
              <Link href="/contact-us" className="hover:text-amber-200 transition-colors">
                Contact Us
              </Link>
            </div>
            <p className="text-xs opacity-75 mt-1">
              © {new Date().getFullYear()} Spiritual Guidance Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 