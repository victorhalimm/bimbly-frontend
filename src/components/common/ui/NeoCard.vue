<template>
  <div
    :class="cardClasses"
    class="relative bg-white border-4 border-black rounded-lg"
    @mouseenter="internalHover = true"
    @mouseleave="internalHover = false"
  >
    <!-- Shadow Effect -->
    <div :class="shadowClasses" class="absolute inset-0 rounded-lg"></div>

    <!-- Content -->
    <div class="relative z-10 p-8">
      <slot />
    </div>

    <!-- Corner Accent (for some variants) -->
    <div
      v-if="accent"
      class="absolute top-0 right-0 w-8 h-8 bg-primary transform rotate-45 translate-x-4 -translate-y-4"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'NeoCard',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'elevated', 'bordered', 'accent'].includes(value),
    },
    hover: {
      type: Boolean,
      default: false,
    },
    accent: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const internalHover = ref(false);

    const cardClasses = computed(() => {
      const baseClasses = ['transition-all', 'duration-300'];

      const variantClasses: Record<string, string[]> = {
        default: ['shadow-lg'],
        elevated: ['shadow-2xl'],
        bordered: ['shadow-sm'],
        accent: ['shadow-lg'],
      };

      const stateClasses = [];
      if (props.hover || internalHover.value) {
        stateClasses.push('transform', 'scale-105');
      }

      return [...baseClasses, ...variantClasses[props.variant], ...stateClasses];
    });

    const shadowClasses = computed(() => {
      const baseClasses = [
        'border-4',
        'border-black',
        'rounded-lg',
        'opacity-20',
        'transform',
        'translate-x-1',
        'translate-y-1',
      ];

      if (props.hover || internalHover.value) {
        baseClasses.push('translate-x-2', 'translate-y-2');
      }

      return baseClasses;
    });

    return {
      cardClasses,
      shadowClasses,
      internalHover,
    };
  },
});
</script>