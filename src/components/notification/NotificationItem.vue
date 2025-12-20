<template>
  <div
    class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
    @click="handleClick"
  >
    <div class="flex-shrink-0 mt-1">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center"
        :class="iconBackgroundClass"
      >
        <component :is="notificationIcon" size="20" stroke="2" class="text-white" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2 mb-1">
        <h4 class="text-sm font-semibold text-gray-900">{{ notification.title }}</h4>
        <span class="text-xs text-gray-400 flex-shrink-0">{{ timeAgo }}</span>
      </div>
      <p class="text-sm text-gray-600">{{ notification.body }}</p>
    </div>

    <div v-if="!notification.hasRead" class="flex-shrink-0 mt-2">
      <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Notification } from '@/services/notification.service';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconCalendar,
  IconCoin,
  IconFileText,
  IconMessage,
  IconStar,
} from '@tabler/icons-vue';

export default defineComponent({
  name: 'NotificationItem',
  components: {
    IconAlertCircle,
    IconAlertTriangle,
    IconInfoCircle,
    IconCircleCheck,
    IconCalendar,
    IconCoin,
    IconFileText,
    IconMessage,
    IconStar,
  },
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },
  emits: ['click'],
  computed: {
    notificationIcon(): any {
      const iconMap: Record<string, any> = {
        error: 'IconAlertCircle',
        warning: 'IconAlertTriangle',
        info: 'IconInfoCircle',
        success: 'IconCircleCheck',
        booking: 'IconCalendar',
        payment: 'IconCoin',
        quiz: 'IconFileText',
        message: 'IconMessage',
        review: 'IconStar',
      };
      return iconMap[this.notification.type] || 'IconInfoCircle';
    },
    iconBackgroundClass(): string {
      const colorMap: Record<string, string> = {
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
        success: 'bg-green-500',
        booking: 'bg-blue-600',
        payment: 'bg-yellow-600',
        quiz: 'bg-purple-500',
        message: 'bg-gray-600',
        review: 'bg-yellow-500',
      };
      return colorMap[this.notification.type] || 'bg-blue-500';
    },
    timeAgo(): string {
      const now = new Date();
      const createdAt = new Date(this.notification.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

      return createdAt.toLocaleDateString();
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.notification);
    },
  },
});
</script>
