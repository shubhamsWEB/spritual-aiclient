import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types';
import { sendChatMessage } from '@/services/api';
import { getRandomWelcomeMessage } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';
import { getCookie } from '@/utils/cookies';
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState({
    prompt: 0,
    completion: 0,
    total: 0
  });
  const { isAuthenticated, user } = useAuth();

  // Initialize with welcome message
  useEffect(() => {
    // Add system message immediately
    if(isAuthenticated) {
    const systemMessage = {
      id: uuidv4(),
      text: "Ask me about the spiritual wisdom in the Bhagavad Gita. You can inquire about life's purpose, duty (dharma), devotion (bhakti), knowledge (jnana), action (karma), and more.",
      type: 'system' as const,
      timestamp: Date.now()
    };
    
    // Add personalized welcome message if authenticated
    const welcomeMessageText = getRandomWelcomeMessage(user?.name && user.name.split(' ')[0] || '');
    
    // Start with just the system message
    setMessages([systemMessage]);
    
    // Add bot welcome message after 1.5 seconds
    const timer = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: welcomeMessageText,
          type: 'bot',
          timestamp: Date.now()
        }
      ]);
    }, 1500);
    return () => clearTimeout(timer);
    }
    // Clean up timeout if component unmounts
  }, [isAuthenticated, user]); // Re-run when authentication state changes

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: messageText,
      type: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token if available
      const token = getCookie('authToken');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await sendChatMessage(messageText, headers);
      console.log("🚀 ~ sendMessage ~ response:", response);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Unknown error occurred');
      }
      
      // Format source references
      const sourceRefs: string[] = [];
      if (response.data.sources && response.data.sources.length > 0) {
        response.data.sources.forEach((source: any) => {
          if (source.metadata && source.metadata.chapter) {
            if (source.metadata.verse) {
              sourceRefs.push(`Chapter ${source.metadata.chapter}, Verse ${source.metadata.verse}`);
            } else {
              sourceRefs.push(`Chapter ${source.metadata.chapter}`);
            }
          } else if (source.metadata && source.metadata.paragraph_id !== undefined) {
            sourceRefs.push(`Paragraph ${source.metadata.paragraph_id}`);
          }
        });
      }
      
      // Update token usage
      if (response.data.metadata?.tokenUsage) {
        const tokensUsed = response.data.metadata.tokenUsage;
        setTokens(prev => ({
          prompt: prev.prompt + (tokensUsed.prompt_tokens || 0),
          completion: prev.completion + (tokensUsed.completion_tokens || 0),
          total: prev.total + (tokensUsed.prompt_tokens || 0) + (tokensUsed.completion_tokens || 0)
        }));
      }
      
      // Add bot response
      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: response.data.answer,
        type: 'bot',
        sources: sourceRefs.length > 0 ? sourceRefs : undefined,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Check if it's an authentication error
      const authError = err instanceof Error && 
        (err.message.includes('Authentication required') || 
         err.message.includes('Authorization') ||
         err.message.includes('Auth'));
         
      // Add appropriate error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: authError 
          ? 'Please sign in to continue receiving divine wisdom.'
          : 'I apologize, but I encountered an error processing your question. Please try again.',
        type: 'bot',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    messages,
    isLoading, 
    error,
    sendMessage,
    tokens
  };
}