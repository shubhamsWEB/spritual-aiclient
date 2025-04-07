import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChatNowButton from '../common/ChatNowButton';
const features = [
  {
    icon: "👤",
    title: "Ask Your Question",
    description: "Whether you're feeling stuck, stressed, or seeking direction - just type your question and start chatting."
  },
  {
    icon: "💡",
    title: "Receive AI-Powered Wisdom",
    description: "Our AI, trained on the Bhagavad Gita, responds as Krishna might - with insight, calm, and clarity. Every answer is rooted in timeless spiritual truth"
  },
  {
    icon: "🌱",
    title: "Apply the Guidance",
    description: "Use what you learn to shift your mindset, your choices, and your life. Let Krishna's teachings help you rise above confusion and find your path."
  },
  {
    icon: "💭",
    title: "Kindly Note",
    description: "It is not a substitute for professional mental health or financial advice. Responses are generated for guidance purposes only."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
            HOW IT WORKS?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how GitaSpeaks brings the timeless wisdom of the Bhagavad Gita into your daily life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative">
          {/* Features Grid */}
          <div className="space-y-12">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-xl font-serif text-gray-700 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            {features.slice(2, 4).map((feature, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-xl font-serif text-gray-700 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Hand Illustration */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Image
              src="/images/hand-illustration.svg"
              alt="Decorative Hand Illustration"
              width={200}
              height={400}
              className="opacity-20"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
         <ChatNowButton />
        </div>
      </div>
    </section>
  );
} 