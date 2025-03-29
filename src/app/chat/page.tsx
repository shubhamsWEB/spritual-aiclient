'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import Image from 'next/image';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import Link from 'next/link';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, tokens } = useChat();
  const { isAuthenticated, user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { viewportHeight, headerHeight } = useViewportHeight();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Calculate available height (subtract header height and some padding)
  const chatContainerHeight = viewportHeight ? `${viewportHeight - headerHeight - 32}px` : '85vh';

  // Auto-scroll the message container when messages change
  useEffect(() => {
    // Use a small timeout to ensure the DOM has updated
    const scrollTimer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages, isLoading]); // Also trigger on isLoading changes to scroll when typing indicator appears

  // Set a limit of free messages for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
        setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  // Handle send message for authenticated and non-authenticated users
  const handleSendMessage = (message: string) => {
    if (isAuthenticated || !showLoginPrompt) {
      sendMessage(message);
    } else {
      // If the login prompt is shown and user is not authenticated,
      // don't allow more messages
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <main className="flex-1 container mx-auto px-1 sm:px-4 py-1 sm:py-4 flex flex-col relative">
        {/* Decorative elements - only show on larger screens */}
        <div className="absolute -left-10 top-1/4 hidden xl:block opacity-20 pointer-events-none">
          <Image
            src="/images/peacock-feather.svg"
            alt="Decorative Peacock Feather"
            width={120}
            height={240}
          />
        </div>

        <div className="absolute -right-10 top-1/2 hidden xl:block opacity-20 pointer-events-none">
          <Image
            src="/images/hand-illustration.svg"
            alt="Decorative Hand Illustration"
            width={120}
            height={240}
          />
        </div>

        {/* Main chat container with dynamic height */}
        <div 
          className="bg-white rounded-lg sm:rounded-2xl shadow-xl flex flex-col border border-amber-100 mx-auto w-full max-w-5xl"
          style={{ height: chatContainerHeight }}
        >
          {/* Header with responsive layout */}
          <div className="p-2 sm:p-4 bg-gradient-to-r from-[#973B00] to-[#BA4D00] text-white flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-between">
            <div className='flex flex-row justify-between mt-1 sm:mt-0 items-center w-full'>
              <div>
                <h1 className="text-md sm:text-xl font-serif">Bhagavad Gita Divine Guide</h1>
                <p className="text-xs sm:text-sm opacity-90">Seek wisdom from the timeless teachings</p>
              </div>
              <div>
                <p className="text-xs opacity-90">
                  <span>Tokens: </span>{' '}
                  <span className="font-bold">{tokens.total}</span>
                </p>
                <p className='text-xs opacity-90'>  <i>Input: </i>{tokens.prompt}</p>
                <p className='text-xs opacity-90'>  <i>Output: </i>{tokens.completion}</p>
              </div>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gradient-to-b from-amber-50/50 to-white"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-amber-100 z-10">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              isDisabled={showLoginPrompt && !isAuthenticated}
            />
          </div>
        </div>
      </main>
    </div>
  );
}