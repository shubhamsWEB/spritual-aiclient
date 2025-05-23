import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChatNowButton from '@/components/common/ChatNowButton';
const socialLinks = [
  {
    name: 'Instagram',
    icon: '/images/social/instagram.svg',
    url: 'https://www.instagram.com/gitaspeaks_ai/'
  },
  {
    name: 'Facebook',
    icon: '/images/social/facebook.svg',
    url: 'https://www.facebook.com/GitaSpeaksAI/'
  },
  {
    name: 'X (Twitter)',
    icon: '/images/social/x.svg',
    url: 'https://x.com/gitaspeaks_ai'
  }
];

export default function CTASection() {
  return (
    <section className="py-10 bg-amber-50">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
            Ready to receive wisdom from the Gita?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with GitaSpeaks now
          </p>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-[1px] w-12 bg-gray-300"></div>
            <div className="text-2xl">✧</div>
            <div className="h-[1px] w-12 bg-gray-300"></div>
          </div>

          {/* CTA Button */}
            <ChatNowButton />
        </div>

        {/* Footer Section */}
        <footer className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Social Links */}
          <div>
            <h3 className="text-2xl font-serif text-gray-700 mb-4">FOLLOW US</h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={32}
                    height={32}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-serif text-gray-700 mb-4">CONTACT US</h3>
            <a
              href="mailto:contact@gitaspeaks.com"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              contact@gitaspeaks.com
            </a>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-2xl font-serif text-gray-700 mb-4">DOCUMENTS</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Blog
                </Link>
              </li> */}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
} 