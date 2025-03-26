import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { text, type, sources } = message;

  // Different styles based on message type
  const messageStyles = {
    user: 'bg-purple-100 text-purple-900 border border-purple-200 ml-auto',
    bot: 'bg-amber-50 text-[#973B00] border-l-4 border-[#973B00] border-t border-r border-b border-amber-200',
    system: 'bg-gradient-to-r from-purple-50 to-amber-50 text-[#973B00] mx-auto text-center italic border border-amber-200'
  };

  // Container styles for alignment
  const containerStyles = {
    user: 'flex justify-end',
    bot: 'flex justify-start',
    system: 'flex justify-center'
  };

  return (
    <div className={`${containerStyles[type]} w-full`}>
      <div className={`rounded-lg p-4 mb-4 shadow-sm animate-fadeIn ${messageStyles[type]} sm:max-w-[75%] max-w-[85%] inline-block`}>
        <div className="prose" dangerouslySetInnerHTML={{ __html: text }} />
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-2 text-xs text-[#973B00] border-t border-amber-200">
            <strong>Sources:</strong> {sources.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
} 