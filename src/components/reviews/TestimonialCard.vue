<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex gap-1 mb-4">
      <IconStarFilled
        v-for="i in 5"
        :key="i"
        size="18"
        class="text-yellow-400"
      />
    </div>

    <p class="text-gray-700 leading-relaxed mb-6">
      {{ displayText }}
    </p>

    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          :src="avatarUrl"
          :alt="review.student.fullName"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-900">{{ review.student.fullName }}</span>
        <span class="text-gray-300">|</span>
        <span class="text-blue-600 font-medium text-sm">{{ roleLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconStarFilled } from '@tabler/icons-vue';
import type { Review } from '@/services/reviews.service';

const MAX_LENGTH = 150;

export default defineComponent({
  name: 'TestimonialCard',
  components: {
    IconStarFilled,
  },
  props: {
    review: {
      type: Object as () => Review,
      required: true,
    },
  },
  computed: {
    avatarUrl(): string {
      if (this.review.student.profileImageUrl) {
        return this.review.student.profileImageUrl;
      }
      return (
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(this.review.student.fullName) +
        '&background=3b82f6&color=fff&size=128'
      );
    },
    displayText(): string {
      const text = this.review.reviewText || this.review.reviewTitle;
      if (text.length > MAX_LENGTH) {
        return text.slice(0, MAX_LENGTH) + '...';
      }
      return text;
    },
    roleLabel(): string {
      return 'Student';
    },
  },
});
</script>
