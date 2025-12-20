<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="handleCancel"
  >
    <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
      <div class="text-center">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          :class="iconBgColor"
        >
          <svg class="w-10 h-10" :class="iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="iconPath"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex gap-3">
          <button
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            :disabled="loading"
            class="flex-1 px-6 py-3 font-semibold rounded-full transition-colors disabled:opacity-50"
            :class="confirmButtonClass"
            @click="handleConfirm"
          >
            {{ loading ? loadingText : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SimpleConfirmModal',
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    loadingText: {
      type: String,
      default: 'Processing...',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'danger',
      validator: (value: string) => ['danger', 'warning', 'info', 'success'].includes(value),
    },
  },
  emits: ['confirm', 'cancel'],
  computed: {
    iconBgColor(): string {
      const colors = {
        danger: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
        success: 'bg-green-100',
      };
      return colors[this.variant as keyof typeof colors];
    },
    iconColor(): string {
      const colors = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        success: 'text-green-600',
      };
      return colors[this.variant as keyof typeof colors];
    },
    iconPath(): string {
      const paths = {
        danger: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      };
      return paths[this.variant as keyof typeof paths];
    },
    confirmButtonClass(): string {
      const classes = {
        danger: 'bg-red-500 text-white hover:bg-red-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'bg-blue-500 text-white hover:bg-blue-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
      };
      return classes[this.variant as keyof typeof classes];
    },
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
});
</script>
