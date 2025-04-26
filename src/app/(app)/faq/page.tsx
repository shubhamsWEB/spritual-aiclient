'use client'
import React from 'react';
import FAQSection from '@/components/home/FAQSection';
import Link from 'next/link';


export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header Section */}

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-700 mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're here to help you on your spiritual journey. If you can't find the answer you're looking for, please reach out to our support team.
            </p>
            <Link
              href="/contact-us"
              className="inline-block bg-[#973B00] text-white px-8 py-3 rounded-lg hover:bg-[#7a2f00] transition-colors duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 