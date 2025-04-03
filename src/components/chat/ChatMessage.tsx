import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { text, type, sources } = message;

  // Different styles based on message type
  const messageStyles = {
    user: 'bg-purple-100 text-purple-900 border border-purple-200 ml-auto text-sm sm:text-base',
    bot: 'bg-amber-50 text-[#973B00] border-l-4 border-[#973B00] border-t border-r border-b border-amber-200 text-sm sm:text-base',
    system: 'bg-gradient-to-r from-purple-50 to-amber-50 text-[#973B00] mx-auto text-center italic border border-amber-200 text-xs'
  };

  // Container styles for alignment
  const containerStyles = {
    user: 'flex justify-end',
    bot: 'flex justify-start',
    system: 'flex justify-center'
  };

  // Format sources based on their type
  const formattedSources = sources && sources.length > 0 
    ? sources.map((source: any) => {
        // If source is an object with metadata containing chapter and verse
        if (typeof source === 'object' && source.metadata && 
            source.metadata.chapter !== undefined && source.metadata.verse !== undefined) {
          return `Chapter ${source.metadata.chapter}, Verse ${source.metadata.verse}`;
        }
        // If source is an object with reference property
        else if (typeof source === 'object' && source.reference) {
          return source.reference;
        }
        // If source is already a string
        return source;
      })
    : [];

  return (
    <div className={`${containerStyles[type]} w-full`}>
      <div className={`rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 shadow-sm animate-fadeIn ${messageStyles[type]} sm:max-w-[75%] max-w-[90%] inline-block`}>
        <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
        
        {sources && sources.length > 0 && (
          <div className="mt-1 pt-1 sm:mt-2 sm:pt-2 text-xs text-[#973B00] border-t border-amber-200">
            <strong>Sources:</strong> {formattedSources.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}