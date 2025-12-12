<template>
  <div class="h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-black text-gray-900">Messages</h2>
      <button
        class="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700"
        @click="$emit('new-chat')"
      >
        + New
      </button>
    </div>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
    </div>

    <div v-else-if="conversations.length === 0" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Belum ada percakapan</p>
      <p class="text-gray-400 text-sm mt-1">Mulai chat dengan tutor atau siswa</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        :class="[
          'flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-blue-50',
          activeConversationId === conversation.id ? 'bg-blue-100' : '',
        ]"
        @click="$emit('select', conversation.id)"
      >
        <div class="relative">
          <div
            v-if="conversation.participant.profileImageUrl"
            class="w-12 h-12 rounded-full overflow-hidden bg-gray-200"
          >
            <img
              :src="conversation.participant.profileImageUrl"
              :alt="conversation.participant.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg"
          >
            {{ getInitials(conversation.participant.name) }}
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <p class="font-bold text-gray-900 truncate">
              {{ conversation.participant.name }}
            </p>
            <span
              v-if="conversation.lastMessageAt"
              class="text-xs text-gray-500 flex-shrink-0 ml-2"
            >
              {{ formatTime(conversation.lastMessageAt) }}
            </span>
          </div>
          <p class="text-sm text-gray-500 truncate mt-0.5">
            {{ conversation.lastMessage?.text || 'Belum ada pesan' }}
          </p>
        </div>

        <div
          v-if="conversation.unreadCount > 0"
          class="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <span class="text-xs text-white font-bold">
            {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Conversation } from '@/types/chat';

export default defineComponent({
  name: 'ConversationList',
  props: {
    conversations: {
      type: Array as PropType<Conversation[]>,
      required: true,
    },
    activeConversationId: {
      type: String as PropType<string | null>,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select', 'new-chat'],
  methods: {
    getInitials(name: string): string {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    },
    formatTime(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (days === 1) {
        return 'Kemarin';
      } else if (days < 7) {
        return date.toLocaleDateString('id-ID', { weekday: 'short' });
      } else {
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
        });
      }
    },
  },
});
</script>
