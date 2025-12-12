<template>
  <div :class="['flex', isSent ? 'justify-end' : 'justify-start', 'mb-3']">
    <div
      :class="[
        'max-w-[70%] rounded-[1.5rem] px-5 py-3 shadow-md',
        isSent
          ? 'bg-blue-600 text-white rounded-br-md'
          : 'bg-gray-100 text-gray-900 rounded-bl-md',
      ]"
    >
      <p v-if="!isSent" class="text-xs font-semibold text-blue-600 mb-1">
        {{ message.senderName }}
      </p>
      <p class="text-base leading-relaxed whitespace-pre-wrap break-words">
        {{ message.messageText }}
      </p>
      <p
        :class="[
          'text-xs mt-1',
          isSent ? 'text-blue-100' : 'text-gray-500',
        ]"
      >
        {{ formattedTime }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Message } from '@/types/chat';

export default defineComponent({
  name: 'MessageBubble',
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedTime(): string {
      const date = new Date(this.message.createdAt);
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
});
</script>
