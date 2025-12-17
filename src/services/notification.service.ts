import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'error' | 'warning' | 'info' | 'success' | 'booking' | 'payment' | 'quiz' | 'message' | 'review';
  hasRead: boolean;
  createdAt: Date;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
  };
}

export const notificationService = {
  async getNotifications(): Promise<NotificationListResponse> {
    const response = await axios.get(`${API_URL}/notifications`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await axios.get(`${API_URL}/notifications/unread-count`, {
      withCredentials: true,
    });
    return response.data.count;
  },

  async markAsRead(notificationIds?: string[]): Promise<void> {
    await axios.post(
      `${API_URL}/notifications/mark-as-read`,
      { notificationIds },
      { withCredentials: true },
    );
  },
};
