<template>
  <div class="bg-white rounded-2xl p-6 shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img :src="review.student.profileImageUrl || defaultAvatar" :alt="review.student.fullName"
            class="w-full h-full object-cover" />
        </div>

        <div>
          <h4 class="text-base font-bold text-gray-900">
            {{ review.student.fullName }}
          </h4>
          <p class="text-sm text-gray-500">{{ getRelativeTime(review.createdAt) }}</p>
        </div>
      </div>

      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold" :class="ratingBadgeClass">
        {{ review.rating.toFixed(1) }}
        <IconStarFilled size="14" />
      </span>
    </div>

    <h3 class="text-lg font-bold text-gray-900 mb-2">
      {{ review.reviewTitle }}
    </h3>

    <div v-if="review.reviewText" class="text-gray-600 leading-relaxed">
      <p v-if="!isExpanded && shouldTruncate">
        {{ truncatedText }}
        <button @click="isExpanded = true"
          class="text-blue-600 font-medium hover:text-blue-700 ml-1 hover:cursor-pointer">
          See more
        </button>
      </p>
      <p v-else>
        {{ review.reviewText }}
        <button v-if="shouldTruncate" @click="isExpanded = false"
          class="text-blue-600 font-medium hover:text-blue-700 ml-1 hover:cursor-pointer">
          Show less
        </button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconStarFilled } from '@tabler/icons-vue';
import type { Review } from '../../services/reviews.service';

const MAX_LENGTH = 200;

export default defineComponent({
  name: 'ReviewCard',
  components: {
    IconStarFilled,
  },
  props: {
    review: {
      type: Object as () => Review,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  computed: {
    defaultAvatar(): string {
      return (
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(this.review.student.fullName) +
        '&background=93c5fd&color=fff'
      );
    },
    shouldTruncate(): boolean {
      return (this.review.reviewText?.length || 0) > MAX_LENGTH;
    },
    truncatedText(): string {
      if (!this.review.reviewText) return '';
      return this.review.reviewText.slice(0, MAX_LENGTH) + '...';
    },
    ratingBadgeClass(): string {
      const rating = this.review.rating;
      if (rating >= 4) return 'bg-green-100 text-green-700';
      if (rating >= 3) return 'bg-yellow-100 text-yellow-700';
      return 'bg-red-100 text-red-700';
    },
  },
  methods: {
    getInitials(name: string): string {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    getRelativeTime(dateString: string): string {
      const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
      const units: [number, string][] = [
        [31536000, 'year'],
        [2592000, 'month'],
        [604800, 'week'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
      ];

      for (const [secondsInUnit, unit] of units) {
        const count = Math.floor(seconds / secondsInUnit);
        if (count > 0) return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
      }
      return 'Just now';
    },
  },
});
</script>

<style scoped></style>
