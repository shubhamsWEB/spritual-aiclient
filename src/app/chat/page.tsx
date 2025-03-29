'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import Tooltip from '@/components/ui/Tooltip';
import Image from 'next/image';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, tokens } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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


  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <main className="flex-1 container mx-auto px-1 sm:px-4 py-1 sm:py-4 flex flex-col relative">
        {/* Decorative elements */}
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

        {/* Main chat container with improved mobile height */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl flex flex-col border border-amber-100 mx-auto w-full max-w-5xl h-[85vh] sm:h-[85vh] overflow-hidden">
          {/* Header with responsive layout */}
          <div className="p-2 sm:p-4 bg-gradient-to-r from-[#973B00] to-[#BA4D00] text-white flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-serif">Bhagavad Gita Divine Guide</h1>
              <p className="text-xs sm:text-sm opacity-90">Seek wisdom from the timeless teachings</p>
            </div>
            <div className="flex flex-row sm:flex-col justify-end mt-1 sm:mt-0">
              <Tooltip position="top" content={<div className='w-[60px]'>
                <h1>Input: {tokens.prompt}</h1>
                <h1>Output: {tokens.completion}</h1>
              </div>}>
                <p className="text-xs sm:text-sm opacity-90">
                  <span>Tokens Consumed: </span>{' '}
                  <span className="font-bold">{tokens.total}</span>
                </p>
              </Tooltip>
              
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
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
} 