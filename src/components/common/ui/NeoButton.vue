<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Loading State -->
    <span v-if="loading" class="inline-flex items-center">
      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span v-if="$slots.default" class="ml-2">
        <slot />
      </span>
    </span>

    <!-- Normal State -->
    <span v-else class="inline-flex items-center">
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'NeoButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'danger', 'success'].includes(value),
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
    },
  },
  emits: ['click'],
  setup(props) {
    const hover = ref(false);

    const buttonClasses = computed(() => {
      const baseClasses = [
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'font-black',
        'border-4',
        'rounded-lg',
        'transition-all',
        'duration-200',
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-black',
        'focus:ring-opacity-25',
      ];

      const sizeClasses = {
        sm: ['px-6', 'py-3', 'text-sm'],
        md: ['px-8', 'py-4', 'text-base'],
        lg: ['px-10', 'py-5', 'text-lg'],
      };

      const variantClasses = {
        primary: [
          'bg-primary',
          'text-white',
          'border-black',
          'shadow-lg',
          'hover:bg-primary',
          'hover:shadow-xl',
          'hover:translate-x-1',
          'hover:translate-y-1',
        ],
        secondary: [
          'bg-white',
          'text-gray-900',
          'border-black',
          'shadow-lg',
          'hover:bg-gray-100',
          'hover:shadow-xl',
          'hover:translate-x-1',
          'hover:translate-y-1',
        ],
        danger: [
          'bg-error',
          'text-white',
          'border-black',
          'shadow-lg',
          'hover:bg-error',
          'hover:shadow-xl',
          'hover:translate-x-1',
          'hover:translate-y-1',
        ],
        success: [
          'bg-success',
          'text-white',
          'border-black',
          'shadow-lg',
          'hover:bg-success',
          'hover:shadow-xl',
          'hover:translate-x-1',
          'hover:translate-y-1',
        ],
      };

      const stateClasses = [];
      if (props.disabled || props.loading) {
        stateClasses.push('opacity-50', 'cursor-not-allowed', 'transform-none', 'translate-x-0', 'translate-y-0');
      }

      return [...baseClasses, ...sizeClasses[props.size], ...variantClasses[props.variant], ...stateClasses];
    });

    return {
      buttonClasses,
    };
  },
});
</script>