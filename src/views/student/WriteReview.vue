<template>
  <div class="write-review-page p-6 max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">Write a Review</h1>
      <p class="text-gray-600 mt-2">Share your experience with this tutor</p>
    </div>

    <NeoCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-3">
            Rating *
          </label>
          <RatingStars
            v-model="formData.rating"
            size="xl"
            :interactive="true"
            :show-value="true"
          />
          <p class="text-xs text-gray-500 mt-2">
            Click on a star to set your rating
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Review (Optional)
          </label>
          <NeoTextarea
            v-model="formData.reviewText"
            placeholder="Share your experience with this tutor. What did you like? What could be improved?"
            rows="6"
            :maxlength="1000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.reviewText.length }} / 1000 characters
          </p>
        </div>

        <div v-if="error" class="mt-4">
          <NeoAlert variant="error">
            {{ error }}
          </NeoAlert>
        </div>

        <div v-if="success" class="mt-4">
          <NeoAlert variant="success">
            Review submitted successfully! Thank you for your feedback.
          </NeoAlert>
        </div>

        <div class="flex space-x-4 pt-4">
          <NeoButton
            type="submit"
            variant="primary"
            :disabled="isLoading || formData.rating === 0 || success"
          >
            {{ isLoading ? 'Submitting...' : 'Submit Review' }}
          </NeoButton>
          <NeoButton
            type="button"
            variant="secondary"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </NeoButton>
        </div>
      </form>
    </NeoCard>

    <div class="mt-8">
      <NeoCard class="bg-gray-50">
        <div class="space-y-3">
          <h3 class="text-lg font-black text-gray-900">Review Guidelines</h3>
          <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Be honest and constructive in your feedback</li>
            <li>Focus on your learning experience with the tutor</li>
            <li>Mention specific examples if possible</li>
            <li>Reviews are public and cannot be edited after submission</li>
            <li>Inappropriate reviews may be removed by administrators</li>
          </ul>
        </div>
      </NeoCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoTextarea, NeoAlert, RatingStars } from '@/components/common/ui';
import { useReviewsStore } from '@/stores/reviews.store';
import { useRouter, useRoute } from 'vue-router';

interface FormData {
  bookingId: string;
  tutorId: string;
  rating: number;
  reviewText: string;
}

interface ComponentData {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default defineComponent({
  name: 'WriteReview',
  components: { NeoCard, NeoButton, NeoTextarea, NeoAlert, RatingStars },
  data(): ComponentData {
    return {
      formData: {
        bookingId: '',
        tutorId: '',
        rating: 0,
        reviewText: '',
      },
      isLoading: false,
      error: null,
      success: false,
    };
  },
  computed: {
    reviewsStore() {
      return useReviewsStore();
    },
  },
  mounted() {
    const route = useRoute();
    const bookingId = route.query.bookingId as string;
    const tutorId = route.query.tutorId as string;

    if (!bookingId || !tutorId) {
      this.error = 'Missing required information. Please try again.';
      return;
    }

    this.formData.bookingId = bookingId;
    this.formData.tutorId = tutorId;
  },
  methods: {
    async handleSubmit() {
      if (this.formData.rating === 0) {
        this.error = 'Please select a rating';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.success = false;

      try {
        const data: any = {
          bookingId: this.formData.bookingId,
          tutorId: this.formData.tutorId,
          rating: this.formData.rating,
        };

        if (this.formData.reviewText.trim()) {
          data.reviewText = this.formData.reviewText.trim();
        }

        await this.reviewsStore.createReview(data);

        this.success = true;
        setTimeout(() => {
          this.handleCancel();
        }, 2000);
      } catch (err: any) {
        this.error = err.message || 'Failed to submit review';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      const router = useRouter();
      router.back();
    },
  },
});
</script>
