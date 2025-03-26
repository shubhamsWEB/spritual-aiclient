import axios from 'axios';

const api = axios.create({
  baseURL: `/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendChatMessage = async (message: string) => {
  try {
    const response = await api.post('/chat', {
      question: message,
      language: 'en'  // Default to English
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default api; 