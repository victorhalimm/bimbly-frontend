<template>
  <div v-if="isOpen" class="fixed inset-0 z-50" @click="handleBackdropClick">
    <div class="absolute top-16 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white">Notifications</h3>
          <button
            @click="close"
            class="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Close"
          >
            <IconX size="20" stroke="2" />
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="notifications.length === 0" class="py-12 px-6 text-center">
          <IconBellOff size="48" stroke="1.5" class="mx-auto text-gray-300 mb-3" />
          <p class="text-gray-500 text-sm">No notifications</p>
        </div>

        <div v-else>
          <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @click="handleNotificationClick"
          />
        </div>
      </div>

      <div
        v-if="notifications.length > 0"
        class="border-t border-gray-200 px-6 py-3 bg-gray-50"
      >
        <button
          @click="markAllAsRead"
          class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Mark All as Read
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNotificationStore } from '@/stores/notification.store';
import NotificationItem from './NotificationItem.vue';
import { IconX, IconBellOff } from '@tabler/icons-vue';
import type { Notification } from '@/services/notification.service';

export default defineComponent({
  name: 'NotificationDialog',
  components: {
    NotificationItem,
    IconX,
    IconBellOff,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      notificationStore: useNotificationStore(),
    };
  },
  computed: {
    notifications() {
      return this.notificationStore.notifications;
    },
    loading() {
      return this.notificationStore.loading;
    },
  },
  watch: {
    isOpen(newValue: boolean) {
      if (newValue) {
        this.notificationStore.fetchNotifications();
      }
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleBackdropClick(event: MouseEvent) {
      if (event.target === event.currentTarget) {
        this.close();
      }
    },
    async handleNotificationClick(notification: Notification) {
      if (!notification.hasRead) {
        await this.notificationStore.markAsRead(notification.id);
      }
    },
    async markAllAsRead() {
      await this.notificationStore.markAllAsRead();
    },
  },
});
</script>
