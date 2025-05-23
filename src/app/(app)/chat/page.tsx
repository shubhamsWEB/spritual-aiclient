'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/contexts/ConversationsContext';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ConversationsSidebar from '@/components/chat/ConversationsSidebar';
import EmptyConversation from '@/components/chat/EmptyConversation';
import PaywallModal from '@/components/chat/PaywallModal';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import styles from '@/components/chat/ConversationsSidebar.module.css';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, tokens, startNewChat } = useChat();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { conversations, isLoadingMessages, fetchConversationMessages, setCurrentConversationId, currentConversationId } = useConversations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { viewportHeight, headerHeight } = useViewportHeight();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConversationsOnMobile, setShowConversationsOnMobile] = useState(true);
  const [freeChatCount, setFreeChatCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('freeChatCount') || '0', 10);
    }
    return 0;
  });

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
  }, [messages, isLoading]);

  // Set a limit of free messages for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  // Track free chat count
  useEffect(() => {
    if (isAuthenticated && messages.length > 0 && !user?.subscription?.hasActiveSubscription) {
      const userMessages = messages.filter(msg => msg.type === 'user').length;
      const newCount = Math.max(freeChatCount, userMessages);
      setFreeChatCount(newCount);
      localStorage.setItem('freeChatCount', newCount.toString());
      
      if (newCount >= 3) {
        setShowPaywallModal(true);
      }
    }
  }, [messages, isAuthenticated, freeChatCount]);

  // Function to refresh the current conversation messages
  const refreshConversation = useCallback(() => {
    if (currentConversationId) {
      fetchConversationMessages(currentConversationId);
    }
  }, [currentConversationId, fetchConversationMessages]);

  // Handle send message for authenticated and non-authenticated users
  const handleSendMessage = (message: string) => {
    if (isAuthenticated && freeChatCount >= 3 && !user?.subscription?.hasActiveSubscription) {
      setShowPaywallModal(true);
      return;
    }

    if (isAuthenticated || !showLoginPrompt) {
      sendMessage(message);
      // On mobile, ensure we're showing the chat view after sending a message
      if (window.innerWidth < 768) {
        setShowConversationsOnMobile(false);
      }
    } else {
      // If the login prompt is shown and user is not authenticated,
      // don't allow more messages
      return;
    }
  };

  // Handle new chat creation
  const handleNewChat = () => {
    if (isAuthenticated && freeChatCount >= 3 && !user?.subscription?.hasActiveSubscription) {
      setShowPaywallModal(true);
      return;
    }
    const newConversationId = startNewChat();
    
    // On mobile, switch to chat view when creating a new chat
    if (window.innerWidth < 768) {
      setShowConversationsOnMobile(false);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // When toggling sidebar on mobile, also update the mobile view state
    if (window.innerWidth < 768) {
      setShowConversationsOnMobile(!showConversationsOnMobile);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    // On mobile, ensure we're showing the chat view after selecting a conversation
    if (window.innerWidth < 768) {
      setShowConversationsOnMobile(false);
    }
  };

  // Prevent scrolling on the body element when component mounts (mobile only)
  useEffect(() => {
    // Function to check if device is mobile
    const isMobileDevice = () => {
      return window.innerWidth < 768; // Common breakpoint for mobile devices
    };

    // Only apply scroll lock on mobile devices
    if (isMobileDevice()) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }

    // Cleanup function to restore body scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // When a conversation is selected, show the chat view on mobile
  useEffect(() => {
    if (currentConversationId && window.innerWidth < 768) {
      setShowConversationsOnMobile(false);
    }
  }, [currentConversationId]);

  return (
    <div className="flex flex-col bg-amber-50 overflow-hidden" style={{ height: chatContainerHeight }}>
      {/* Overlay for mobile - only visible when sidebar is open on mobile */}
      <div
        className={`${styles.sidebarOverlay} ${showConversationsOnMobile ? styles.sidebarOverlayVisible : ''}`}
        onClick={() => setShowConversationsOnMobile(false)}
      />

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Conversations Panel - Always visible on desktop, conditionally on mobile */}
        <div className={`${showConversationsOnMobile ? 'block' : 'hidden'} md:block md:w-80 h-full z-20 relative`}>
          <ConversationsSidebar
            isOpen={true}
            onToggle={toggleSidebar}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Panel - Always visible on desktop, conditionally on mobile */}
        <div className={`${showConversationsOnMobile ? 'hidden' : 'block'} md:block flex-1 h-full flex flex-col overflow-hidden`}>
          {/* Chat container with fixed header, scrollable content, and fixed footer */}
          <div className="flex flex-col h-full bg-white border border-amber-100">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-2 sm:p-4 bg-gradient-to-r from-[#973B00] to-[#BA4D00] text-white flex flex-row items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setShowConversationsOnMobile(true)}
                  className="mr-2 text-white md:hidden"
                  aria-label="Back to conversations"
                >
                  <FiArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-md sm:text-xl font-serif">Bhagavad Gita Divine Guide</h1>
                  <p className="text-xs sm:text-sm opacity-90">Seek wisdom from the timeless teachings</p>
                </div>
              </div>
              {currentConversationId && (
                <button
                  onClick={refreshConversation}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  disabled={isLoadingMessages}
                  title="Refresh conversation"
                >
                  <FiRefreshCw size={18} className={isLoadingMessages ? "animate-spin" : ""} />
                </button>
              )}
            </div>

            {/* Login Prompt (if needed) */}
            {!isAuthenticated && showLoginPrompt && (
              <div className="flex-shrink-0 p-2 sm:p-4 bg-amber-50 text-amber-900 text-center">
                <p>Please login to continue</p>
              </div>
            )}

            {/* Main Content Area */}
            {currentConversationId ? (
              <>
                {/* Scrollable Messages Container */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    position: "relative"
                  }}
                >
                  {/* Background image container */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                    style={{
                      overflow: "hidden"
                    }}
                  >
                    <img 
                      src="/images/peacock-feather.svg" 
                      alt="" 
                      className="w-1/4 opacity-15"
                      style={{
                        objectFit: "contain",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    />
                  </div>
                  
                  {/* Chat messages with higher z-index */}
                  <div className="relative z-10">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}

                    {isLoading && <TypingIndicator />}
                    {isLoadingMessages && messages.length === 0 && (
                      <div className="flex justify-center my-8">
                        <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-lg shadow-sm">
                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-amber-800">Loading messages...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Fixed Input Area */}
                <div className="flex-shrink-0 w-full bg-white border-t border-amber-100">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isDisabled={(showLoginPrompt && !isAuthenticated) || isLoadingMessages || (isAuthenticated && freeChatCount >= 3 && !user?.subscription?.hasActiveSubscription)}
                  />
                </div>
              </>
            ) : (
              <>
                <EmptyConversation onNewChat={handleNewChat} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgrade={() => {
          // TODO: Implement upgrade flow
          router.push('/pricing');
          setShowPaywallModal(false);
        }}
      />
    </div>
  );
}