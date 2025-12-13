import axios from 'axios';
import type {
  Conversation,
  ConversationCreate,
  Message,
  MessageListResponse,
} from '@/types/chat';

const API_URL = import.meta.env.VITE_API_URL;

export const chatService = {
  async getConversations(): Promise<{ data: Conversation[] }> {
    const response = await axios.get(`${API_URL}/conversations`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createConversation(participantId: string): Promise<ConversationCreate> {
    const response = await axios.post(
      `${API_URL}/conversations`,
      { participantId },
      { withCredentials: true },
    );
    return response.data;
  },

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<MessageListResponse> {
    const response = await axios.get(
      `${API_URL}/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
        withCredentials: true,
      },
    );
    return response.data;
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const response = await axios.post(
      `${API_URL}/conversations/${conversationId}/messages`,
      { text },
      { withCredentials: true },
    );
    return response.data;
  },
};
