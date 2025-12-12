<template>
  <div class="border-t border-gray-200 bg-white p-4">
    <div class="flex items-end gap-3">
      <div class="flex-1 relative">
        <textarea
          ref="inputRef"
          v-model="message"
          :disabled="disabled"
          class="w-full px-5 py-3 border-2 border-gray-200 rounded-[1.5rem] resize-none overflow-hidden focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          :class="{ 'opacity-50': disabled }"
          rows="1"
          placeholder="Ketik pesan..."
          @input="handleInput"
          @keydown="handleKeydown"
        ></textarea>
      </div>
      <button
        :disabled="disabled || !message.trim()"
        class="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        @click="handleSend"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MessageInput',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['send'],
  data() {
    return {
      message: '',
    };
  },
  methods: {
    handleInput() {
      this.adjustTextareaHeight();
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.handleSend();
      }
    },
    handleSend() {
      const text = this.message.trim();
      if (text && !this.disabled) {
        this.$emit('send', text);
        this.message = '';
        this.$nextTick(() => {
          this.adjustTextareaHeight();
        });
      }
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.inputRef as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${newHeight}px`;
      }
    },
    focus() {
      const textarea = this.$refs.inputRef as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    },
  },
});
</script>
