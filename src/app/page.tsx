'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import FeatureSection from '@/components/home/FeatureSection';
import ChatNowButton from '@/components/common/ChatNowButton';
export default function Home() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[280px] h-[400px] md:w-[400px] md:h-[600px]">
              <div className="absolute top-0 left-0 right-0 h-[260px] md:h-[400px]">
                <Image
                  src="/images/krishna-flute.svg"
                  alt="Krishna Playing Flute"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {isPlaying && (
                <div className="absolute top-[-5%] left-[-60%] right-0 h-[260px] md:h-[400px] w-[100%] pointer-events-none">
                  <Image
                    src="/images/notes.svg"
                  alt="Musical Notes"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              )}
              <div className="absolute top-[200px] md:top-[330px] left-0 right-0 h-[180px] md:h-[250px]">
                <Image
                  src="/images/peacock-feather.svg"
                  alt="Peacock Feathers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800">
              Struggling with Life Problems?
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600">
              <q>The Bhagavad Gita Has the Answers</q>
            </h2>
            
            <div className="flex justify-center md:justify-start items-center gap-3">
              <ChatNowButton />
              <AudioPlayer audioSrc="/audio/flute.mp3" isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
            </div>

            <div className="space-y-3 md:space-y-4 mt-4 md:mt-8">
              <h3 className="text-xl md:text-2xl text-gray-700">
                Seek Wisdom from the AI-Powered Bhagvad Gita
              </h3>
              <p className="text-base md:text-lg text-gray-600 italic">
                Now, with Gita Guide, you can experience that wisdom in a 
                personal, accessible way.
              </p>
              <p className="text-base md:text-lg text-gray-600 italic">
                Ask your questions. Share your challenges.<br className="hidden md:block" />
                Clarity. Purpose. Peace — one message at a time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <HowItWorksSection />
      <FeatureSection />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </div>
  );
}

// Audio Player Component with combined functionality
function AudioPlayer({ audioSrc, isPlaying, setIsPlaying }: { audioSrc: string, isPlaying: boolean, setIsPlaying: (isPlaying: boolean) => void }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(err => {
          console.log("Audio play was prevented:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md">
      <audio ref={audioRef} src={audioSrc} loop />
      
      {/* Combined Play/Pause/Mute Button */}
      <button 
        onClick={toggleAudio}
        className="text-gray-700 hover:text-amber-600 transition-colors"
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>
    </div>
  );
} 