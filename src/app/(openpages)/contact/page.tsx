import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/SecondaryHeader';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { FiMail, FiMapPin, FiMessageCircle } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us – GitaSpeaks',
  description: 'Get in touch with the GitaSpeaks team for support, feedback, or inquiries',
};

export default function ContactPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-[#973B00]">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
            <h2 className="text-2xl font-semibold mb-4 text-[#973B00]">Send Us a Message</h2>
            <p className="text-gray-600 mb-6">
              Have questions about GitaSpeaks or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#973B00]">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <FiMail className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <a href="mailto:contact@gitaspeaks.com" className="text-[#973B00] hover:underline">
                      contact@gitaspeaks.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <FiMessageCircle className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Support</h3>
                    <p className="text-gray-600">
                      For the fastest response, please use our contact form or email us directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h2 className="text-2xl font-semibold mb-4 text-[#973B00]">Follow Us</h2>
              <p className="text-gray-600 mb-4">
                Stay connected with us on social media for updates, spiritual insights, and more.
              </p>
              
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/gitaspeaks_ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-100 p-3 rounded-full hover:bg-amber-200 transition-colors"
                >
                  <Image
                    src="/images/social/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://www.facebook.com/GitaSpeaksAI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-100 p-3 rounded-full hover:bg-amber-200 transition-colors"
                >
                  <Image
                    src="/images/social/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://x.com/gitaspeaks_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-100 p-3 rounded-full hover:bg-amber-200 transition-colors"
                >
                  <Image
                    src="/images/social/x.svg"
                    alt="X (Twitter)"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#973B00]">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-4">
            Before reaching out, you might find answers to common questions in our FAQ section.
          </p>
          <Link 
            href="/#faq" 
            className="inline-block bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            View FAQs
          </Link>
        </div>
        
        {/* Additional Resources */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
          <h2 className="text-2xl font-semibold mb-4 text-[#973B00]">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/privacy-policy" className="p-4 border border-amber-100 rounded-lg hover:bg-amber-50 transition-colors">
              <h3 className="font-medium text-[#973B00] mb-2">Privacy Policy</h3>
              <p className="text-gray-600 text-sm">Learn how we protect your personal information.</p>
            </Link>
            <Link href="/terms-and-conditions" className="p-4 border border-amber-100 rounded-lg hover:bg-amber-50 transition-colors">
              <h3 className="font-medium text-[#973B00] mb-2">Terms and Conditions</h3>
              <p className="text-gray-600 text-sm">Review our terms of service and usage guidelines.</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 