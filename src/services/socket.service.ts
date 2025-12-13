import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL;

export interface MessageReceived {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  createdAt: string;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  joinConversation(conversationId: string): void {
    if (this.socket) {
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  leaveConversation(conversationId: string): void {
    if (this.socket) {
      this.socket.emit('leave_conversation', { conversationId });
    }
  }

  sendMessage(conversationId: string, text: string): void {
    if (this.socket) {
      this.socket.emit('send_message', { conversationId, text });
    }
  }

  onMessageReceived(callback: (message: MessageReceived) => void): void {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  offMessageReceived(): void {
    if (this.socket) {
      this.socket.off('message_received');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
