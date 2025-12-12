export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  userType: string;
  profileImageUrl: string | null;
}

export interface LastMessage {
  text: string;
  senderId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant: Participant;
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationCreate {
  id: string;
  studentId: string;
  tutorId: string;
  participant: Participant;
  createdAt: string;
}

export interface MessageListResponse {
  data: Message[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}
