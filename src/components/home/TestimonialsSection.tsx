import React from 'react';
import Image from 'next/image';
import ChatNowButton from '../common/ChatNowButton';

const testimonials = [
  {
    name: "Jamie Folsom",
    image: "/images/testimonials/jamie.jpg",
    text: "I was going through a tough time in my career, and GitaSpeaks's AI gave me exactly the perspective I needed. It was calm, wise, and eerily accurate.",
    rating: 5
  },
  {
    name: "Ryan Hughes",
    image: "/images/testimonials/ryan.jpg",
    text: "The AI replied with something from the Gita that touched me deeply. It helped me let go of guilt and take a step forward.",
    rating: 5
  },
  {
    name: "Anthony Garrett",
    image: "/images/testimonials/anthony.jpg",
    text: "She starts her day asking a question and feels like she's received Krishna's blessings. It's become part of her morning prayer routine.",
    rating: 5
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-6 h-6 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section className="py-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 text-center mb-16">
          Testimonials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Image Container */}
              <div className="w-32 h-32 rounded-lg overflow-hidden mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Name */}
              <h3 className="text-2xl font-serif text-gray-700">
                {testimonial.name}
              </h3>

              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed max-w-sm">
                {testimonial.text}
              </p>

              {/* Star Rating */}
              <StarRating rating={testimonial.rating} />
            </div>
          ))}
        </div>
        
        {/* Call to action with ChatNowButton */}
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 mb-6">
            Experience the wisdom of the Bhagavad Gita for yourself
          </p>
          <ChatNowButton />
        </div>
      </div>
    </section>
  );
} 