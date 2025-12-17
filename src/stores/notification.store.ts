import { defineStore } from 'pinia';
import {
  notificationService,
  type Notification,
  type NotificationListResponse,
} from '../services/notification.service';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    unreadNotifications: (state): Notification[] => {
      return state.notifications.filter((n) => !n.hasRead);
    },

    hasUnread: (state): boolean => {
      return state.unreadCount > 0;
    },
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      this.error = null;
      try {
        const response: NotificationListResponse =
          await notificationService.getNotifications();
        this.notifications = response.data;
        this.unreadCount = response.meta.unreadCount;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch notifications';
        console.error('Error fetching notifications:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        this.unreadCount = await notificationService.getUnreadCount();
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    },

    async markAsRead(notificationId?: string) {
      try {
        if (notificationId) {
          await notificationService.markAsRead([notificationId]);
          const notification = this.notifications.find(
            (n) => n.id === notificationId,
          );
          if (notification) {
            notification.hasRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

    async markAllAsRead() {
      try {
        await notificationService.markAsRead();
        this.notifications.forEach((n) => {
          n.hasRead = true;
        });
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    },
  },
});
