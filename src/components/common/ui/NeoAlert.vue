<template>
  <div v-if="visible" :class="alertClasses">
    <div class="flex items-start space-x-3">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg v-if="variant === 'error'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else-if="variant === 'success'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else-if="variant === 'warning'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else-if="variant === 'info'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h3 v-if="title" class="text-lg font-bold text-white mb-1">
          {{ title }}
        </h3>
        <p class="text-white font-medium">
          {{ message }}
        </p>
      </div>

      <!-- Dismiss Button -->
      <div v-if="dismissible" class="flex-shrink-0">
        <button
          @click="handleDismiss"
          class="inline-flex text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'NeoAlert',
  props: {
    variant: {
      type: String,
      default: 'info',
      validator: (value: string) => ['error', 'success', 'warning', 'info'].includes(value),
    },
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    dismissible: {
      type: Boolean,
      default: false,
    },
    autoDismiss: {
      type: Boolean,
      default: false,
    },
    autoDismissDelay: {
      type: Number,
      default: 5000,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    const visible = ref(true);

    const alertClasses = computed(() => {
      const baseClasses = [
        'relative',
        'border-4',
        'border-black',
        'rounded-lg',
        'p-4',
        'shadow-lg',
        'transition-all',
        'duration-300',
      ];

      const variantClasses = {
        error: [
          'bg-error',
          'text-white',
        ],
        success: [
          'bg-success',
          'text-white',
        ],
        warning: [
          'bg-warning',
          'text-white',
        ],
        info: [
          'bg-primary',
          'text-white',
        ],
      };

      return [...baseClasses, ...variantClasses[props.variant]];
    });

    const handleDismiss = () => {
      visible.value = false;
      emit('dismiss');
    };

    onMounted(() => {
      if (props.autoDismiss) {
        setTimeout(() => {
          handleDismiss();
        }, props.autoDismissDelay);
      }
    });

    return {
      visible,
      alertClasses,
      handleDismiss,
    };
  },
});
</script>