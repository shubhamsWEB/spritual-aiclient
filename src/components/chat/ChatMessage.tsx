import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import SourceReference from './SourceReference';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { text, type, sources } = message;
  const [displayedText, setDisplayedText] = React.useState('');
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setDisplayedText(text);
  }, [text, type]);

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

  return (
    <div className={`${containerStyles[type]} w-full`}>
      <div className={`rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 shadow-sm animate-fadeIn ${messageStyles[type]} sm:max-w-[75%] max-w-[90%] inline-block`}>
        <div className="prose prose-sm sm:prose max-w-none">
          {type === 'bot' ? (
            <div dangerouslySetInnerHTML={{ __html: displayedText }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )}
          {isAnimating && type === 'bot' && (
            <span className="inline-block w-1 h-4 ml-1 bg-[#973B00] animate-pulse"></span>
          )}
        </div>
        
        {sources && sources.length > 0 && (
          <div className="mt-1 pt-1 sm:mt-2 sm:pt-2 text-xs border-t border-amber-200">
            <strong className="text-[#973B00]">Sources:</strong>{' '}
            {sources.map((source, index) => (
              <span key={index}>
                {index > 0 && ', '}
                <SourceReference 
                  chapter={source.metadata?.chapter} 
                  verse={source.metadata?.verse}
                  paragraph_id={source.metadata?.paragraph_id}
                />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}