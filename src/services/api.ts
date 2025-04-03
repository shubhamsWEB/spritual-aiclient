import axios from 'axios';
import { handleApiResponse, handleApiError } from './utils/api';
import { getCookie } from '@/utils/cookies';
const api = axios.create({
  baseURL: `/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a chat message to the API
 * @param {string} message - The user's message
 * @param {string} conversationId - Optional conversation ID
 * @param {Record<string, string>} headers - Optional headers like Authorization
 * @returns {Promise<any>} - The API response
 */
export const sendChatMessage = async (
  message: string, 
  conversationId?: string,
  headers: Record<string, string> = {}
) => {
  try {
    const response = await api.post('/chat', {
      question: message,
      language: 'en',  // Default to English
      conversationId: conversationId || undefined
    }, {
      headers: {
        ...headers
      }
    });
    console.log("🚀 ~ sendChatMessage ~ response:", response);
    return handleApiResponse(response);
  } catch (error) {
    console.log("🚀 ~ sendChatMessage ~ error:", error);
    console.error('Error sending message:', error);
    handleApiError(error);
  }
};

/**
 * Get all conversations for the current user
 * @returns {Promise<any>} - Conversations data
 */
export const getConversations = async () => {
  try {
    const token = getCookie('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get('/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("🚀 ~ getConversations ~ response:", response);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting conversations:', error);
    handleApiError(error);
  }
};

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - The ID of the conversation
 * @returns {Promise<any>} - Conversation messages data
 */
export const getConversationsMessages = async (conversationId: string) => {
  try {
    const token = getCookie('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get(`/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    handleApiError(error);
  }
};

/**
 * Get the current user profile
 * @returns {Promise<any>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const token = getCookie('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting user profile:', error);
    handleApiError(error);
  }
};

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<any>} - Updated user data
 */
export const updateUserProfile = async (data: any) => {
  try {
    const token = getCookie('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.put('/auth/profile', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating profile:', error);
    handleApiError(error);
  }
};

export default api;