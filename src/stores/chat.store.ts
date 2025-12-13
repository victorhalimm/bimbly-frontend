import { defineStore } from 'pinia';
import { chatService } from '../services/chat.service';
import type { Conversation, Message } from '@/types/chat';
import { socketService } from '../services/socket.service';
import type { MessageReceived } from '../services/socket.service';

interface MessagesState {
  [conversationId: string]: Message[];
}

interface ChatState {
  connected: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: MessagesState;
  loading: boolean;
  loadingMessages: boolean;
  error: string | null;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    connected: false,
    conversations: [],
    activeConversationId: null,
    messages: {},
    loading: false,
    loadingMessages: false,
    error: null,
  }),

  getters: {
    activeConversation: (state): Conversation | null => {
      if (!state.activeConversationId) return null;
      return (
        state.conversations.find((c) => c.id === state.activeConversationId) ||
        null
      );
    },

    activeMessages: (state): Message[] => {
      if (!state.activeConversationId) return [];
      return state.messages[state.activeConversationId] || [];
    },

    sortedConversations: (state): Conversation[] => {
      return [...state.conversations].sort((a, b) => {
        if (!a.lastMessageAt && !b.lastMessageAt) return 0;
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return (
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
        );
      });
    },
  },

  actions: {
    connect() {
      socketService.connect();
      this.connected = socketService.isConnected();

      socketService.onMessageReceived((message: MessageReceived) => {
        this.handleMessageReceived(message);
      });

      const socket = socketService.getSocket();
      if (socket) {
        socket.on('connect', () => {
          this.connected = true;
        });
        socket.on('disconnect', () => {
          this.connected = false;
        });
        socket.on('unread_update', (data: { conversationId: string; unreadCount: number }) => {
          this.handleUnreadUpdate(data.conversationId, data.unreadCount);
        });
        socket.on('conversation_update', (data: {
          conversationId: string;
          lastMessage: { text: string; senderId: string; createdAt: string };
          lastMessageAt: string;
        }) => {
          this.handleConversationUpdate(data);
        });
      }
    },

    disconnect() {
      const socket = socketService.getSocket();
      if (socket) {
        socket.off('unread_update');
        socket.off('conversation_update');
      }
      socketService.offMessageReceived();
      socketService.disconnect();
      this.connected = false;
      this.activeConversationId = null;
    },

    async loadConversations() {
      this.loading = true;
      this.error = null;
      try {
        const response = await chatService.getConversations();
        this.conversations = response.data;
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        this.error =
          err.response?.data?.message || 'Failed to load conversations';
      } finally {
        this.loading = false;
      }
    },

    async loadMessages(conversationId: string, page: number = 1) {
      this.loadingMessages = true;
      try {
        const response = await chatService.getMessages(conversationId, page);
        const messages = response.data.reverse();

        if (page === 1) {
          this.messages[conversationId] = messages;
        } else {
          this.messages[conversationId] = [
            ...messages,
            ...(this.messages[conversationId] || []),
          ];
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        this.error = err.response?.data?.message || 'Failed to load messages';
      } finally {
        this.loadingMessages = false;
      }
    },

    async createConversation(participantId: string) {
      try {
        const conversation = await chatService.createConversation(participantId);
        await this.loadConversations();
        return conversation;
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        this.error =
          err.response?.data?.message || 'Failed to create conversation';
        throw error;
      }
    },

    joinConversation(conversationId: string) {
      if (this.activeConversationId) {
        socketService.leaveConversation(this.activeConversationId);
      }
      this.activeConversationId = conversationId;
      socketService.joinConversation(conversationId);

      const convIndex = this.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex].unreadCount = 0;
      }
    },

    leaveConversation() {
      if (this.activeConversationId) {
        socketService.leaveConversation(this.activeConversationId);
        this.activeConversationId = null;
      }
    },

    async sendMessage(text: string) {
      if (!this.activeConversationId || !text.trim()) return;

      if (socketService.isConnected()) {
        socketService.sendMessage(this.activeConversationId, text.trim());
      } else {
        try {
          const message = await chatService.sendMessage(this.activeConversationId, text.trim());
          this.handleMessageReceived({
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            senderName: message.senderName,
            messageText: message.messageText,
            createdAt: message.createdAt,
          });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          this.error = err.response?.data?.message || 'Failed to send message';
        }
      }
    },

    handleMessageReceived(message: MessageReceived) {
      const { conversationId } = message;

      if (!this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }

      const exists = this.messages[conversationId].some(
        (m) => m.id === message.id,
      );
      if (!exists) {
        this.messages[conversationId].push({
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          messageText: message.messageText,
          createdAt: message.createdAt,
        });
      }

      const convIndex = this.conversations.findIndex(
        (c) => c.id === conversationId,
      );
      if (convIndex !== -1) {
        this.conversations[convIndex].lastMessage = {
          text: message.messageText,
          senderId: message.senderId,
          createdAt: message.createdAt,
        };
        this.conversations[convIndex].lastMessageAt = message.createdAt;
      }
    },

    clearError() {
      this.error = null;
    },

    handleUnreadUpdate(conversationId: string, unreadCount: number) {
      const convIndex = this.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex] = {
          ...this.conversations[convIndex],
          unreadCount,
        };
      }
    },

    handleConversationUpdate(data: {
      conversationId: string;
      lastMessage: { text: string; senderId: string; createdAt: string };
      lastMessageAt: string;
    }) {
      const convIndex = this.conversations.findIndex((c) => c.id === data.conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex] = {
          ...this.conversations[convIndex],
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
        };
      }
    },
  },
});
