import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ChatNowButton from '../common/ChatNowButton';

const testimonials = [
  {
    name: "Meenakshi Sharma",
    image: "/images/testimonials/1.jpeg",
    text: "During a difficult career transition, Gita Speaks provided me with the clarity I needed. The wisdom from the Gita helped me understand my purpose and make decisions with confidence.",
    rating: 5
  },
  {
    name: "Priyanka Gupta",
    image: "/images/testimonials/2.png",
    text: "I've been studying the Bhagavad Gita for years, but Gita Speaks helped me apply its teachings to my daily challenges. The AI found verses that perfectly addressed my situation and give me comfort during difficult times",
    rating: 5
  },
  {
    name: "Rajan Devnath",
    image: "/images/testimonials/3.jpg",
    text: "GitaSpeaks has deepened my understanding of selfless action. I've incorporated the Gita's teachings into my daily meditation practice, and it's helped me maintain balance while running my business.",
    rating: 5
  },
  {
    name: "Sandhya Thakur",
    image: "/images/testimonials/4.png",
    text: "When I was struggling with grief, GitaSpeaks shared teachings on the eternal nature of the soul. It brought me immense peace during a difficult time and helped me process my emotions.",
    rating: 5
  },
  {
    name: "Vasudeva Das",
    image: "/images/testimonials/5.jpg",
    text: "I start each morning with a question for GitaSpeaks. The insights have transformed how I approach challenges at work and home. It's like having a spiritual mentor available whenever I need guidance.",
    rating: 4.5
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(Math.floor(rating))].map((_, i) => (
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Auto-advance the carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = isMobile 
          ? testimonials.length - 1 
          : Math.max(0, testimonials.length - 3);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
  };
  
  const goToPrevious = () => {
    if (isMobile) {
      const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
      goToSlide(newIndex);
    } else {
      const newIndex = currentIndex === 0 ? Math.max(0, testimonials.length - 3) : currentIndex - 1;
      goToSlide(newIndex);
    }
  };
  
  const goToNext = () => {
    if (isMobile) {
      const newIndex = currentIndex >= testimonials.length - 1 ? 0 : currentIndex + 1;
      goToSlide(newIndex);
    } else {
      const maxIndex = Math.max(0, testimonials.length - 3);
      const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      goToSlide(newIndex);
    }
  };

  return (
    <section className="py-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 text-center mb-16">
          Testimonials
        </h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Carousel container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (isMobile ? 100 : 100/3)}%)` 
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/3 flex-shrink-0 flex flex-col items-center text-center space-y-4 px-4"
                >
                  {/* Image Container */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-gray-100">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-fill"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl md:text-2xl font-serif text-gray-700">
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
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicator dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {/* For mobile: show one dot per testimonial */}
            <div className="flex md:hidden space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* For desktop: show dots for groups of 3 */}
            <div className="hidden md:flex space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index * 3)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex >= index * 3 && currentIndex < (index + 1) * 3 ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
            </div>
          </div>
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