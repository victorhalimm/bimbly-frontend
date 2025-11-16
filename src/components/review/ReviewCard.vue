<template>
  <NeoCard class="review-card">
    <div class="space-y-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary-500 border-4 border-black rounded-full flex items-center justify-center">
              <span class="text-white font-black text-lg">
                {{ studentInitial }}
              </span>
            </div>
            <div>
              <p class="font-black text-gray-900">{{ review.studentName || 'Student' }}</p>
              <p class="text-xs text-gray-600">{{ formattedDate }}</p>
            </div>
          </div>
        </div>
        <RatingStars
          :rating="review.rating"
          size="lg"
          :interactive="false"
        />
      </div>

      <div v-if="review.reviewText" class="border-l-4 border-primary-500 pl-4 py-2">
        <p class="text-gray-700">{{ review.reviewText }}</p>
      </div>

      <div
        v-if="review.tutorResponse"
        class="bg-gray-50 border-4 border-black rounded-xl p-4 mt-4"
      >
        <div class="flex items-start space-x-2">
          <div class="w-8 h-8 bg-success-500 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-black text-sm">T</span>
          </div>
          <div class="flex-1">
            <p class="text-xs font-bold text-gray-600 uppercase mb-1">Tutor Response</p>
            <p class="text-gray-700">{{ review.tutorResponse }}</p>
            <p class="text-xs text-gray-500 mt-2">{{ formattedResponseDate }}</p>
          </div>
        </div>
      </div>

      <div
        v-else-if="canRespond"
        class="pt-4 border-t-2 border-gray-200"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          @click="handleRespond"
        >
          Respond to Review
        </NeoButton>
      </div>
    </div>
  </NeoCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { NeoCard, NeoButton, RatingStars } from '@/components/common/ui';

interface Review {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  studentName?: string;
  rating: number;
  reviewText?: string;
  tutorResponse?: string;
  tutorRespondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default defineComponent({
  name: 'ReviewCard',
  components: { NeoCard, NeoButton, RatingStars },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
    canRespond: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    studentInitial(): string {
      const name = this.review.studentName || 'S';
      return name.charAt(0).toUpperCase();
    },

    formattedDate(): string {
      const date = new Date(this.review.createdAt);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },

    formattedResponseDate(): string {
      if (!this.review.tutorRespondedAt) return '';
      const date = new Date(this.review.tutorRespondedAt);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  methods: {
    handleRespond(): void {
      this.$emit('respond', this.review);
    },
  },
  emits: ['respond'],
});
</script>

<style scoped>
.review-card {
  transition: transform 0.2s ease-in-out;
}

.review-card:hover {
  transform: translateY(-2px);
}
</style>
