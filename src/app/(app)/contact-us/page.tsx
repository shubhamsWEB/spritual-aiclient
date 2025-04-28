import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiMail, FiMessageCircle, FiSend, FiUser, FiHelpCircle, FiMap } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us – GitaSpeaks',
  description: 'Get in touch with the GitaSpeaks team for support, feedback, or inquiries',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <FiSend className="text-[#973B00]" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-[#973B00]">Send Us a Message</h2>
            </div>

            <form className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 p-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Your Name"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 p-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHelpCircle className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  id="subject"
                  className="w-full pl-10 p-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Social */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FiMessageCircle className="text-[#973B00]" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-[#973B00]">Get in Touch</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <FiUser className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Contact Person</h3>
                    <p className="text-gray-700">Pritam Thakur</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <FiMail className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Email Us</h3>
                    <a
                      href="mailto:contact@gitaspeaks.com"
                      className="text-[#973B00] hover:text-[#BA4D00] transition-colors"
                    >
                      contact@gitaspeaks.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <FiMap className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Main Office</h3>
                    <p className="text-gray-700">
                      Sopan Niket, Flat 3C, 14A, Raja Rammohan Roy Road,<br />
                      Behala Chowrasta, Kolkata - 700008
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <FiMap className="text-[#973B00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Alternate Office</h3>
                    <p className="text-gray-700">
                      40/4-1, Wellington Street,<br />
                      Richmond Town, Bengaluru - 560025
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-amber-100">
                  <h3 className="font-medium text-gray-800 mb-4">Response Time</h3>
                  <p className="text-gray-600">
                    We typically respond to all inquiries within 24-48 hours. For urgent matters,
                    please mention "URGENT" in your subject line.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
              <h2 className="text-2xl font-semibold text-[#973B00] mb-6">Join Our Community</h2>
              <p className="text-gray-600 mb-6">
                Connect with us on social media for daily spiritual insights, updates, and community discussions.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/gitaspeaks_ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Image
                    src="/images/social/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-[#973B00]">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/GitaSpeaksAI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Image
                    src="/images/social/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-[#973B00]">Facebook</span>
                </a>
                <a
                  href="https://x.com/gitaspeaks_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Image
                    src="/images/social/x.svg"
                    alt="X (Twitter)"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-[#973B00]">Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-white rounded-2xl p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <FiHelpCircle className="text-[#973B00]" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-[#973B00]">Need Quick Answers?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Check our FAQ section for answers to common questions about GitaSpeaks.
            </p>
            <Link
              href="/faq"
              className="inline-block bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 