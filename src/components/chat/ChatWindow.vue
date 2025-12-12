<template>
  <div class="h-full flex flex-col bg-gray-50">
    <div v-if="!conversation" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 text-blue-600"
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
      <p class="text-gray-500 font-medium text-lg">Pilih percakapan</p>
      <p class="text-gray-400 text-sm mt-1">
        Pilih percakapan dari daftar untuk mulai chatting
      </p>
    </div>

    <template v-else>
      <div class="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          class="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          @click="$emit('back')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div
          v-if="conversation.participant.profileImageUrl"
          class="w-10 h-10 rounded-full overflow-hidden bg-gray-200"
        >
          <img
            :src="conversation.participant.profileImageUrl"
            :alt="conversation.participant.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
        >
          {{ getInitials(conversation.participant.name) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-900 truncate">
            {{ conversation.participant.name }}
          </p>
          <p class="text-xs text-gray-500 capitalize">
            {{ conversation.participant.userType }}
          </p>
        </div>
        <div
          :class="[
            'w-3 h-3 rounded-full',
            connected ? 'bg-green-500' : 'bg-gray-400',
          ]"
          :title="connected ? 'Connected' : 'Disconnected'"
        ></div>
      </div>

      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4"
        @scroll="handleScroll"
      >
        <div v-if="loadingMessages" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-if="messages.length === 0 && !loadingMessages" class="flex flex-col items-center justify-center h-full text-center">
          <p class="text-gray-400">Belum ada pesan</p>
          <p class="text-gray-400 text-sm mt-1">Kirim pesan untuk memulai percakapan</p>
        </div>

        <div v-for="(message, index) in messages" :key="message.id">
          <div
            v-if="shouldShowDateSeparator(index)"
            class="flex items-center justify-center my-4"
          >
            <div class="bg-gray-200 px-4 py-1 rounded-full">
              <span class="text-xs text-gray-600 font-medium">
                {{ formatDateSeparator(message.createdAt) }}
              </span>
            </div>
          </div>
          <MessageBubble
            :message="message"
            :is-sent="message.senderId === currentUserId"
          />
        </div>

      </div>

      <MessageInput
        :disabled="false"
        @send="handleSend"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import MessageBubble from './MessageBubble.vue';
import MessageInput from './MessageInput.vue';
import type { Conversation, Message } from '@/types/chat';

export default defineComponent({
  name: 'ChatWindow',
  components: {
    MessageBubble,
    MessageInput,
  },
  props: {
    conversation: {
      type: Object as PropType<Conversation | null>,
      default: null,
    },
    messages: {
      type: Array as PropType<Message[]>,
      default: () => [],
    },
    currentUserId: {
      type: String,
      required: true,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    loadingMessages: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['send', 'loadMore', 'back'],
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
    },
  },
  methods: {
    getInitials(name: string): string {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    },
    handleSend(text: string) {
      this.$emit('send', text);
    },
    handleScroll(event: Event) {
      const target = event.target as HTMLElement;
      if (target.scrollTop === 0 && !this.loadingMessages) {
        this.$emit('loadMore');
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer as HTMLElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    shouldShowDateSeparator(index: number): boolean {
      if (index === 0) return true;
      const currentDate = new Date(this.messages[index].createdAt).toDateString();
      const prevDate = new Date(this.messages[index - 1].createdAt).toDateString();
      return currentDate !== prevDate;
    },
    formatDateSeparator(dateString: string): string {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Hari Ini';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Kemarin';
      } else {
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    },
  },
});
</script>
