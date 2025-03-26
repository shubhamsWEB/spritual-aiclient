import React from 'react';
import Link from 'next/link';

interface ChatNowButtonProps {
  className?: string;
}

const ChatNowButton: React.FC<ChatNowButtonProps> = ({ className = '' }) => {
  return (
    <Link href="/chat">
      <button 
        className={`bg-[#973B00] hover:bg-[#de6b18] text-white text-xl font-bold py-3 px-12 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
      >
        Chat Now
      </button>
    </Link>
  );
};

export default ChatNowButton; 