import React from 'react';
import Image from 'next/image';
import { FiMessageSquare } from 'react-icons/fi';

interface EmptyConversationProps {
  onNewChat: () => void;
}

export default function EmptyConversation({ onNewChat }: EmptyConversationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="relative w-40 h-40">
        <Image
          src="/logo.png"
          alt="Gita Speaks Logo"
          fill
          className="object-contain opacity-50"
        />
      </div>
      
      <h2 className="text-2xl font-serif text-gray-700 mb-3">
        Begin Your Spiritual Journey
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Ask questions about dharma, karma, purpose, meditation, and receive divine wisdom from the Bhagavad Gita.
      </p>
      
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 bg-[#973B00] hover:bg-[#BA4D00] text-white py-3 px-6 rounded-lg transition-colors mb-4"
      >
        <FiMessageSquare size={20} />
        <span>Start a New Conversation</span>
      </button>
      
      <p className="text-sm text-gray-500">
        After clicking "Start a New Conversation", simply type your question in the input box below.
      </p>
    </div>
  );
} 