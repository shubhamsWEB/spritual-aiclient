import React from 'react';

const features = [
  {
    title: "Divine Guidance",
    description: "Receive spiritual wisdom directly inspired by Lord Krishna's teachings in the Bhagavad Gita.",
    icon: "🪷" // Lotus flower emoji
  },
  {
    title: "Deep Knowledge",
    description: "Access profound insights on karma, dharma, devotion, self-realization, and life's purpose.",
    icon: "📜" // Scroll emoji
  },
  {
    title: "Practical Wisdom",
    description: "Learn how to apply ancient spiritual principles to your modern life and challenges.",
    icon: "✨" // Sparkles emoji
  },
  {
    title: "Source References",
    description: "Responses include references to specific chapters and verses from the Bhagavad Gita.",
    icon: "📚" // Books emoji
  }
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
            Sacred Wisdom for Your Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore how the timeless teachings of the Bhagavad Gita can illuminate your path
            and guide you through life's challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-serif text-gray-700 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 