import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4 text-center">About GitaSpeaks</h1>
        
        <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            At GitaSpeaks, our journey begins not with technology but with devotion.
          </p>

          <p>
            We are two humble devotees of ISKCON, both initiated and blessed to have lived intensely within the ISKCON community. For years, we walked the temple corridors, sat in long classes, and listened to timeless conversations about Krishna, Arjuna, and the eternal truths spoken in the Bhagavad Gita.
          </p>

          <p>
            Through countless interactions, one quiet realisation became clear to us:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li className="font-semibold text-gray-800">
              Everyone wants to understand the Bhagavad Gita.
            </li>
            <li className="font-semibold text-gray-800">
              But not everyone has the time.
            </li>
          </ul>

          <p>
            Life today moves fast.
          </p>

          <p>
            Fathers and mothers dream of passing on the Bhagavad Gita's wisdom to their children — but busy schedules and modern distractions make it difficult. Young people yearn for clarity, purpose, and peace — but heavy books and traditional lectures feel out of reach.
          </p>

          <p>
            We saw this gap. We felt it in conversations after aratis, in temple corridors, and over chai shared with seekers from all walks of life.
          </p>

          <p>
            And we built GitaSpeaks to bridge that gap.
          </p>

          <div className="my-8 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <p className="text-xl font-semibold mb-4 text-gray-800">
              GitaSpeaks is not a replacement for the Bhagavad Gita. It is an invitation to it.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className='text-gray-800'>
                A place where a single question can open the door to deep reflection.
              </li>
              <li className='text-gray-800'>
                A space where wisdom meets simplicity without losing its soul.
              </li>
              <li className='text-gray-800'>
                A companion you can reach out to — anytime your heart feels restless, searching, or curious.
              </li>
            </ul>
          </div>

          <p>
            Powered by AI, guided by our devotion, and inspired by Krishna's eternal message, GitaSpeaks offers a way for you — and your children, your families, and your friends — to bring the Bhagavad Gita's teachings into daily life.
          </p>

          <ul className="italic text-gray-600 space-y-2">
            <li className='font-semibold text-gray-800'>Not as an obligation, but as a living conversation.</li>
            <li className='font-semibold text-gray-800'>One message at a time.</li>
            <li className='font-semibold text-gray-800'>One reflection at a time.</li>
            <li className='font-semibold text-gray-800'>One rediscovery at a time.</li>
          </ul>

          <p>
            We believe the Bhagavad Gita was never meant to be locked inside dusty bookshelves. It was meant to live — in questions, in choices, in quiet courage.
          </p>

          <p className="font-semibold text-gray-800">
            At GitaSpeaks, the Bhagavad Gita lives again — through you.
          </p>

          <p className="text-xl text-gray-800">
            Welcome to your journey home.
          </p>

          <div className="mt-12 text-right">
            <p className="font-semibold text-gray-800">With Folded Hands,</p>
            <p className="text-gray-700">The GitaSpeaks Team</p>
          </div>
        </div>
      </div>
    </div>
  );
} 