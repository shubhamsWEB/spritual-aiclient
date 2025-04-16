import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types';
import { sendChatMessage } from '@/services/api';
import { getRandomWelcomeMessage } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/contexts/ConversationsContext';
import { getCookie } from '@/utils/cookies';
import { splitMessageIntoParts } from '@/utils/messages';
export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState({
    prompt: 0,
    completion: 0,
    total: 0
  });
  
  const { isAuthenticated, user } = useAuth();
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversationId,
    updateConversation,
    addMessageToConversation,
    activeConversationMessages,
    setActiveConversationMessages,
    addConversation,
    registerBackendConversation,
    removeConversation
  } = useConversations();

  // Use activeConversationMessages instead of extracting from conversations
  const messages = activeConversationMessages;

  // Initialize with welcome message when a new conversation is created
  useEffect(() => {
    if (isAuthenticated && currentConversationId) {
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      
      // Only add welcome message if this is a new conversation with no messages
      if (currentConversation && activeConversationMessages.length === 0) {
        // Add system message
        const systemMessage = {
          id: uuidv4(),
          text: "Ask me about the spiritual wisdom in the Bhagavad Gita. You can inquire about life's purpose, duty (dharma), devotion (bhakti), knowledge (jnana), action (karma), and more.",
          type: 'system' as const,
          timestamp: Date.now()
        };
        
        // Add personalized welcome message
        const welcomeMessageText = getRandomWelcomeMessage(user?.name && user.name.split(' ')[0] || '');
        
        // Add system message to conversation
        addMessageToConversation(currentConversationId, systemMessage);
        
        // Add bot welcome message after 1.5 seconds
        const timer = setTimeout(() => {
          const botMessage = {
            id: uuidv4(),
            text: welcomeMessageText,
            type: 'bot' as const,
            timestamp: Date.now()
          };
          
          addMessageToConversation(currentConversationId, botMessage);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, currentConversationId, conversations, activeConversationMessages, addMessageToConversation]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    // Use current conversation ID or empty string
    // Let the backend handle creating a new conversation
    const conversationId = currentConversationId || '';
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: messageText,
      type: 'user',
      timestamp: Date.now()
    };
    
    // If we have a conversation ID, add the message to it
    if (conversationId) {
      addMessageToConversation(conversationId, userMessage);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token if available
      const token = getCookie('authToken');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await sendChatMessage(messageText, conversationId, headers);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Unknown error occurred');
      }
      
      // If the API returns a new conversation ID, update the current one
      if (response.data.conversationId && (!conversationId || response.data.conversationId !== conversationId)) {
        // Create a title from the first message
        const title = messageText.split(' ').slice(0, 4).join(' ') + (messageText.split(' ').length > 4 ? '...' : '');
        
        // Register the new conversation in the conversations list
        registerBackendConversation(response.data.conversationId, title);
        
        // If we had a temporary conversation ID, remove it
        if (conversationId && conversationId !== response.data.conversationId) {
          removeConversation(conversationId);
        }
        
        // Update the current conversation ID
        setCurrentConversationId(response.data.conversationId);
        
        // If this was a new conversation (empty ID), we need to add the user message to the new conversation
        if (!conversationId) {
          addMessageToConversation(response.data.conversationId, userMessage);
        }
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
      
      // Split the bot message into parts
      const messageParts = splitMessageIntoParts(response.data.answer);
     const responseConversationId = response.data.conversationId || conversationId;
      
      // Add the first part immediately
      const firstPart: ChatMessage = {
        id: uuidv4(),
        text: messageParts[0],
        type: 'bot',
        timestamp: Date.now(),
        isNew: true,
        sources: response.data.sources // Include sources with the first part
      };
      
      addMessageToConversation(responseConversationId, firstPart);
      
      // Add remaining parts with delay
      if (messageParts.length > 1) {
        for (let i = 1; i < messageParts.length; i++) {
          setTimeout(() => {
            const partMessage: ChatMessage = {
              id: uuidv4(),
              text: messageParts[i],
              type: 'bot',
              timestamp: Date.now(),
              isNew: true,
              sources: response.data.sources
            };
            
            addMessageToConversation(responseConversationId, partMessage);
          }, 1500 * i); // 1.5 second delay between parts
        }
      }
      
      // Update conversation title if it's a new conversation
      if (response.data.conversationId) {
        // Use the first few words of the user's first message as the title
        const title = messageText.split(' ').slice(0, 4).join(' ') + (messageText.split(' ').length > 4 ? '...' : '');
        updateConversation(response.data.conversationId, { title });
      }
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
      
      if (conversationId) {
        addMessageToConversation(conversationId, errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentConversationId, addMessageToConversation, setCurrentConversationId, updateConversation, registerBackendConversation, removeConversation]);

  // Modified to not create a conversation ID on the frontend
  const startNewChat = useCallback(() => {
    // Create a temporary conversation ID
    const tempId = uuidv4();
    
    // Add a temporary conversation to the list
    const newConversation = {
      id: tempId,
      title: 'New Conversation',
      lastMessageTime: Date.now(),
      messages: []
    };
    
    // Add the conversation to the list
    const conversationId = addConversation('New Conversation');
    
    // Set the current conversation ID
    setCurrentConversationId(conversationId);
    
    // Clear active conversation messages
    setActiveConversationMessages([]);
    
    return conversationId;
  }, [setCurrentConversationId, setActiveConversationMessages, addConversation]);

  return {
    messages,
    isLoading, 
    error,
    sendMessage,
    tokens,
    startNewChat,
    currentConversationId
  };
}