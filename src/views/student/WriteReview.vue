<template>
  <div class="min-h-screen bg-gray-50">
    <div class="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 pt-28 pb-16 px-4 overflow-hidden">
      <div class="absolute top-12 right-16 w-36 h-36 bg-blue-200 rounded-full opacity-40 blur-3xl"></div>
      <div class="absolute bottom-24 left-12 w-44 h-44 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>

      <div class="absolute top-1/3 left-20 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-500">
      </div>
      <div class="absolute bottom-1/3 right-16 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000">
      </div>

      <div class="max-w-lg mx-auto relative z-10">
        <button @click="$router.push('/student/bookings')"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer">
          <IconArrowLeft size="20" stroke="2" />
          <span class="font-medium">Back to Bookings</span>
        </button>

        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          Submit
          <span class="relative inline-block px-1">
            <span class="relative z-20">Review</span>
            <svg class="absolute -bottom-1 left-0 w-full h-3 z-10" viewBox="0 0 100 12" preserveAspectRatio="none"
              fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4" />
              <path d="M5,6 Q30,10 55,4 T95,8" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" opacity="0.3" />
            </svg>
          </span>
        </h1>

        <p class="text-gray-600 text-lg mt-4">Share your experience with this tutor</p>
      </div>

      <svg class="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
        <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#f9fafb" />
      </svg>
    </div>

    <div class="max-w-lg mx-auto px-4 py-8">
      <div v-if="loading" class="bg-white rounded-3xl shadow-lg p-12 text-center">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading booking details...</p>
      </div>

      <div v-else-if="!booking" class="bg-white rounded-3xl shadow-lg p-12 text-center">
        <div class="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <IconAlertCircle size="40" stroke="1.5" class="text-gray-400" />
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">Booking Not Found</h2>
        <p class="text-gray-600 mb-8">The booking you're trying to review doesn't exist.</p>
        <button @click="$router.push('/student/bookings')"
          class="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg cursor-pointer inline-flex items-center gap-2">
          <IconArrowLeft size="20" stroke="2" />
          Back to Bookings
        </button>
      </div>

      <div v-else class="bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <img :src="tutorImage" :alt="booking.tutor.fullName" class="w-14 h-14 rounded-full object-cover" />
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 truncate">{{ booking.tutor.fullName }}</h3>
              <p class="text-sm text-gray-500">{{ booking.subject }}</p>
              <p class="text-xs text-gray-400">{{ formattedDate }}</p>
            </div>
          </div>

          <div class="text-center py-2">
            <label class="block text-sm font-bold text-gray-700 mb-4">
              Give overall rating
            </label>
            <div class="flex justify-center gap-2">
              <button v-for="star in 5" :key="star" type="button" @click="formData.rating = star"
                @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                class="transition-transform hover:scale-110 hover:cursor-pointer">
                <svg class="w-9 h-9 transition-colors" :class="getStarColor(star)" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label for="reviewTitle" class="block text-sm font-semibold text-gray-700 mb-2">
              Review Title
            </label>
            <input id="reviewTitle" v-model="formData.reviewTitle" type="text"
              placeholder="e.g., Great teaching session!" maxlength="100"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm" />
            <p class="text-xs text-gray-400 mt-1">{{ formData.reviewTitle.length }}/100</p>
          </div>

          <div>
            <label for="reviewText" class="block text-sm font-semibold text-gray-700 mb-2">
              Add details
            </label>
            <textarea id="reviewText" v-model="formData.reviewText" rows="3" placeholder="Share your experience..."
              maxlength="1000"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-sm"></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ formData.reviewText.length }}/1000</p>
          </div>

          <p class="text-center text-xs text-gray-400">
            You can only submit one review per tutor
          </p>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="$router.push('/student/bookings')"
              class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit"
              :disabled="submitting || formData.rating === 0 || !formData.reviewTitle.trim() || !formData.reviewText.trim()"
              class="flex-1 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-vue';
import { bookingService } from '@/services/booking.service';
import { reviewsService } from '@/services/reviews.service';
import { useToast } from '@/composables/useToast';
import type { Booking } from '@/services/booking.service';

interface ReviewFormData {
  rating: number;
  reviewTitle: string;
  reviewText: string;
}

export default defineComponent({
  name: 'WriteReview',
  components: {
    IconArrowLeft,
    IconAlertCircle,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data(): {
    booking: Booking | null;
    loading: boolean;
    submitting: boolean;
    hoverRating: number;
    formData: ReviewFormData;
  } {
    return {
      booking: null,
      loading: true,
      submitting: false,
      hoverRating: 0,
      formData: {
        rating: 0,
        reviewTitle: '',
        reviewText: '',
      },
    };
  },
  computed: {
    tutorImage(): string {
      if (!this.booking) return '';
      return (
        this.booking.tutor.profileImageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.booking.tutor.fullName)}&background=3b82f6&color=fff`
      );
    },
    formattedDate(): string {
      if (!this.booking) return '';
      const date = new Date(this.booking.bookingDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  },
  async mounted() {
    await this.loadBooking();
  },
  methods: {
    async loadBooking() {
      const bookingId = this.$route.query.bookingId as string;
      if (!bookingId) {
        this.loading = false;
        return;
      }

      try {
        this.booking = await bookingService.getBookingById(bookingId);
      } catch {
        this.toast.error('Error', 'Failed to load booking details');
      } finally {
        this.loading = false;
      }
    },
    getStarColor(star: number): string {
      const activeRating = this.hoverRating > 0 ? this.hoverRating : this.formData.rating;
      return star <= activeRating ? 'text-yellow-400' : 'text-gray-300';
    },
    async handleSubmit() {
      if (!this.booking) return;

      if (this.formData.rating === 0) {
        this.toast.error('Error', 'Please select a rating');
        return;
      }

      if (!this.formData.reviewTitle.trim()) {
        this.toast.error('Error', 'Please enter a review title');
        return;
      }

      if (!this.formData.reviewText.trim()) {
        this.toast.error('Error', 'Please enter review details');
        return;
      }

      this.submitting = true;

      try {
        await reviewsService.create({
          tutorId: this.booking.tutor.id,
          rating: this.formData.rating,
          reviewTitle: this.formData.reviewTitle.trim(),
          reviewText: this.formData.reviewText.trim(),
        });
        this.toast.success('Success', 'Review submitted successfully!');
        this.$router.push('/student/bookings');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to submit review';
        this.toast.error('Error', message);
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}
</style>
