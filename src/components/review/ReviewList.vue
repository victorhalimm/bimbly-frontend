<template>
  <div class="review-list">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-black text-gray-900">Reviews</h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ metadata?.totalReviews || 0 }} reviews • {{ averageRating }} average
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <NeoSelect
          v-model="sortBy"
          :options="sortOptions"
          @update:modelValue="handleSortChange"
        />
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading reviews...</p>
    </div>

    <div v-else-if="error" class="py-12">
      <NeoAlert variant="error">
        {{ error }}
      </NeoAlert>
    </div>

    <div v-else-if="reviews.length === 0" class="text-center py-12">
      <NeoCard>
        <div class="py-8">
          <p class="text-gray-500 font-bold text-lg">
            No reviews yet
          </p>
        </div>
      </NeoCard>
    </div>

    <div v-else class="space-y-4">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        :can-respond="canRespond && !review.tutorResponse"
        @respond="handleRespond"
      />

      <div v-if="showPagination" class="flex justify-center space-x-4 pt-6">
        <NeoButton
          variant="secondary"
          @click="previousPage"
          :disabled="currentPage === 1 || isLoading"
        >
          Previous
        </NeoButton>
        <span class="flex items-center font-bold text-gray-700">
          Page {{ currentPage }}
        </span>
        <NeoButton
          variant="secondary"
          @click="nextPage"
          :disabled="reviews.length < limit || isLoading"
        >
          Next
        </NeoButton>
      </div>
    </div>

    <div
      v-if="showRespondModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeRespondModal"
    >
      <NeoCard class="max-w-2xl w-full mx-4">
        <h3 class="text-2xl font-black text-gray-900 mb-4">
          Respond to Review
        </h3>
        <div class="mb-4">
          <RatingStars
            :rating="respondingToReview?.rating || 0"
            size="lg"
            :interactive="false"
          />
          <p class="text-gray-700 mt-2">{{ respondingToReview?.reviewText }}</p>
        </div>
        <form @submit.prevent="submitResponse">
          <NeoTextarea
            v-model="responseText"
            placeholder="Write your response (10-1000 characters)"
            rows="4"
            required
            :minlength="10"
            :maxlength="1000"
          />
          <p class="text-xs text-gray-500 mt-1 mb-4">
            {{ responseText.length }} / 1000 characters
          </p>
          <div class="flex space-x-4">
            <NeoButton
              type="submit"
              variant="primary"
              :disabled="responseText.length < 10 || isSubmitting"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Response' }}
            </NeoButton>
            <NeoButton
              type="button"
              variant="secondary"
              @click="closeRespondModal"
              :disabled="isSubmitting"
            >
              Cancel
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { NeoCard, NeoButton, NeoSelect, NeoAlert, NeoTextarea, RatingStars } from '@/components/common/ui';
import ReviewCard from './ReviewCard.vue';

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

interface ReviewsMetadata {
  averageRating: number;
  totalReviews: number;
  page?: number;
  limit?: number;
}

interface ComponentData {
  sortBy: string;
  currentPage: number;
  limit: number;
  showRespondModal: boolean;
  respondingToReview: Review | null;
  responseText: string;
  isSubmitting: boolean;
}

export default defineComponent({
  name: 'ReviewList',
  components: { NeoCard, NeoButton, NeoSelect, NeoAlert, NeoTextarea, RatingStars, ReviewCard },
  props: {
    reviews: {
      type: Array as PropType<Review[]>,
      required: true,
    },
    metadata: {
      type: Object as PropType<ReviewsMetadata | null>,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String as PropType<string | null>,
      default: null,
    },
    canRespond: {
      type: Boolean,
      default: false,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
  },
  data(): ComponentData {
    return {
      sortBy: 'createdAt:DESC',
      currentPage: 1,
      limit: 10,
      showRespondModal: false,
      respondingToReview: null,
      responseText: '',
      isSubmitting: false,
    };
  },
  computed: {
    sortOptions() {
      return [
        { label: 'Newest First', value: 'createdAt:DESC' },
        { label: 'Oldest First', value: 'createdAt:ASC' },
        { label: 'Highest Rated', value: 'rating:DESC' },
        { label: 'Lowest Rated', value: 'rating:ASC' },
      ];
    },

    averageRating(): string {
      return this.metadata?.averageRating?.toFixed(2) || '0.00';
    },
  },
  methods: {
    handleSortChange() {
      const [sortField, order] = this.sortBy.split(':');
      this.$emit('sort-change', { sortBy: sortField, order });
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.$emit('page-change', this.currentPage);
      }
    },

    nextPage() {
      this.currentPage++;
      this.$emit('page-change', this.currentPage);
    },

    handleRespond(review: Review) {
      this.respondingToReview = review;
      this.responseText = '';
      this.showRespondModal = true;
    },

    closeRespondModal() {
      this.showRespondModal = false;
      this.respondingToReview = null;
      this.responseText = '';
    },

    async submitResponse() {
      if (!this.respondingToReview || this.responseText.length < 10) return;

      this.isSubmitting = true;
      try {
        this.$emit('respond', {
          reviewId: this.respondingToReview.id,
          response: this.responseText,
        });
        this.closeRespondModal();
      } catch (error) {
        console.error('Failed to submit response:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  emits: ['sort-change', 'page-change', 'respond'],
});
</script>
