<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Write a <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Review</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Share your experience with this tutor</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-xl">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="text-center">
            <label class="block text-lg font-bold text-gray-900 mb-4">
              How would you rate this session?
            </label>
            <div class="flex justify-center">
              <RatingStars
                :rating="formData.rating"
                @update:rating="formData.rating = $event"
                size="lg"
                interactive
                show-label
              />
            </div>
            <p v-if="ratingText" class="mt-4 text-xl font-bold" :class="ratingTextColor">
              {{ ratingText }}
            </p>
          </div>

          <div>
            <label for="reviewText" class="block text-sm font-semibold text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              id="reviewText"
              v-model="formData.reviewText"
              rows="6"
              placeholder="Tell us about your experience with this tutor..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              maxlength="1000"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2">
              {{ formData.reviewText.length }}/1000 characters
            </p>
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              @click="$router.back()"
              class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || formData.rating === 0"
              class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useReviewsStore } from '../../stores/reviews.store';
import RatingStars from '../../components/reviews/RatingStars.vue';

interface FormData {
  rating: number;
  reviewText: string;
}

export default defineComponent({
  name: 'WriteReview',
  components: {
    RatingStars,
  },
  data(): { formData: FormData; loading: boolean } {
    return {
      formData: {
        rating: 0,
        reviewText: '',
      },
      loading: false,
    };
  },
  computed: {
    ratingText(): string {
      const texts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent',
      };
      return texts[this.formData.rating as keyof typeof texts] || '';
    },
    ratingTextColor(): string {
      if (this.formData.rating >= 4) return 'text-green-600';
      if (this.formData.rating >= 3) return 'text-yellow-600';
      return 'text-red-600';
    },
  },
  methods: {
    async handleSubmit() {
      const bookingId = this.$route.params.bookingId as string;
      if (!bookingId) {
        alert('Booking ID is required');
        return;
      }

      if (this.formData.rating === 0) {
        alert('Please select a rating');
        return;
      }

      this.loading = true;
      const store = useReviewsStore();

      try {
        await store.createReview({
          bookingId,
          rating: this.formData.rating,
          reviewText: this.formData.reviewText || undefined,
        });
        alert('Review submitted successfully!');
        this.$router.back();
      } catch (error: any) {
        alert(error.message || 'Failed to submit review');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
