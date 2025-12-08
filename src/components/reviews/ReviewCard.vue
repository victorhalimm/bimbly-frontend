<template>
  <div class="bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
          {{ getInitials(review.student?.fullName || 'Anonymous') }}
        </div>
        <div>
          <h3 class="text-xl font-black text-gray-900">
            {{ review.student?.fullName || 'Anonymous' }}
          </h3>
          <p class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</p>
        </div>
      </div>
      <RatingStars :rating="review.rating" size="md" />
    </div>

    <div v-if="review.reviewText" class="mb-6">
      <p class="text-gray-700 font-medium leading-relaxed">{{ review.reviewText }}</p>
    </div>

    <div v-if="review.tutorResponse" class="bg-blue-50 rounded-2xl p-6 mt-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <span class="text-sm font-bold text-blue-900">Tutor Response</span>
        <span class="text-xs text-gray-500">{{ formatDate(review.tutorRespondedAt!) }}</span>
      </div>
      <p class="text-gray-700 font-medium leading-relaxed">{{ review.tutorResponse }}</p>
    </div>

    <div v-else-if="canRespond" class="mt-4">
      <button
        @click="$emit('respond')"
        class="w-full py-3 bg-blue-100 text-blue-600 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
      >
        Respond to Review
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RatingStars from './RatingStars.vue';
import type { Review } from '../../services/reviews.service';

export default defineComponent({
  name: 'ReviewCard',
  components: {
    RatingStars,
  },
  props: {
    review: {
      type: Object as () => Review,
      required: true,
    },
    canRespond: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['respond'],
  methods: {
    getInitials(name: string): string {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
});
</script>

<style scoped>
</style>
