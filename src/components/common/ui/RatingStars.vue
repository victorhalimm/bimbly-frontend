<template>
  <div class="flex items-center space-x-1">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="!interactive"
      :class="starClasses(star)"
      @click="handleClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
    >
      <svg
        class="w-full h-full"
        :class="[
          getStarFillClass(star),
          interactive ? 'transition-all duration-150' : '',
        ]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>
    <span v-if="showValue" :class="valueClasses">
      {{ displayValue }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface RatingStarsData {
  hoverRating: number;
}

export default defineComponent({
  name: 'RatingStars',
  props: {
    rating: {
      type: Number,
      default: 0,
      validator: (value: number) => value >= 0 && value <= 5,
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value),
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    showValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:rating'],
  data(): RatingStarsData {
    return {
      hoverRating: 0,
    };
  },
  computed: {
    displayValue(): string {
      const value = this.interactive && this.hoverRating > 0 ? this.hoverRating : this.rating;
      return value.toFixed(1);
    },
    starSizeClasses(): Record<string, string> {
      const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10',
      };
      return sizes;
    },
    valueClasses(): string[] {
      const baseClasses = ['font-black', 'text-gray-900'];
      const sizeMap = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      };
      baseClasses.push(sizeMap[this.size]);
      return baseClasses;
    },
  },
  methods: {
    starClasses(star: number): string[] {
      const classes = [
        this.starSizeClasses[this.size],
        'focus:outline-none',
      ];

      if (this.interactive) {
        classes.push('cursor-pointer', 'hover:scale-110', 'focus:scale-110');
      } else {
        classes.push('cursor-default');
      }

      return classes;
    },
    getStarFillClass(star: number): string {
      const currentRating = this.interactive && this.hoverRating > 0 ? this.hoverRating : this.rating;

      if (star <= currentRating) {
        if (currentRating >= 4.5) {
          return 'text-success';
        } else if (currentRating >= 3.5) {
          return 'text-warning';
        } else {
          return 'text-error';
        }
      }

      return 'text-gray-300';
    },
    handleClick(star: number): void {
      if (this.interactive) {
        this.$emit('update:rating', star);
      }
    },
    handleMouseEnter(star: number): void {
      if (this.interactive) {
        this.hoverRating = star;
      }
    },
    handleMouseLeave(): void {
      if (this.interactive) {
        this.hoverRating = 0;
      }
    },
  },
});
</script>
