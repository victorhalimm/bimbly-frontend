<template>
  <div class="flex items-center gap-1" :class="sizeClass">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      @click="selectRating(star)"
      @mouseenter="hoverRating = star"
      @mouseleave="hoverRating = 0"
      :disabled="!interactive"
      :class="[
        'transition-all',
        interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
      ]"
      :aria-label="`Rate ${star} stars`"
    >
      <svg
        class="transition-colors"
        :class="getStarColor(star)"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
    <span v-if="showLabel" class="ml-2 font-bold text-gray-900">{{ displayRating }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RatingStars',
  props: {
    rating: {
      type: Number,
      default: 0,
      validator: (value: number) => value >= 0 && value <= 5,
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg',
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:rating'],
  data() {
    return {
      hoverRating: 0,
    };
  },
  computed: {
    displayRating(): number {
      return this.interactive && this.hoverRating > 0
        ? this.hoverRating
        : this.rating;
    },
    sizeClass(): string {
      const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
      };
      return sizes[this.size];
    },
  },
  methods: {
    selectRating(star: number) {
      if (this.interactive) {
        this.$emit('update:rating', star);
      }
    },
    getStarColor(star: number): string {
      const activeRating = this.interactive && this.hoverRating > 0
        ? this.hoverRating
        : this.rating;

      if (star <= activeRating) {
        return 'text-yellow-500';
      }
      return 'text-gray-300';
    },
  },
});
</script>

<style scoped>
</style>
