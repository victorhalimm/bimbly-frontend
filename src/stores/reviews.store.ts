import { defineStore } from 'pinia';
import reviewsService from '@/services/reviews.service';

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

interface ReviewsState {
  reviews: Review[];
  currentReview: Review | null;
  metadata: ReviewsMetadata | null;
  isLoading: boolean;
  error: string | null;
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    currentReview: null,
    metadata: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getReviewById: (state) => (id: string) => {
      return state.reviews.find((review) => review.id === id);
    },

    getReviewByBookingId: (state) => (bookingId: string) => {
      return state.reviews.find((review) => review.bookingId === bookingId);
    },

    averageRating: (state): number => {
      return state.metadata?.averageRating || 0;
    },

    totalReviews: (state): number => {
      return state.metadata?.totalReviews || 0;
    },
  },

  actions: {
    async createReview(data: {
      bookingId: string;
      tutorId: string;
      rating: number;
      reviewText?: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await reviewsService.create(data);
        this.currentReview = response.data;
        this.reviews.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create review';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviewsByTutor(
      tutorId: string,
      params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
      }
    ) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await reviewsService.getByTutor(tutorId, params);
        this.reviews = response.data.data;
        this.metadata = response.data.meta;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch reviews';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviewByBooking(bookingId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await reviewsService.getByBooking(bookingId);
        this.currentReview = response.data;
        const index = this.reviews.findIndex((r) => r.bookingId === bookingId);
        if (index === -1) {
          this.reviews.push(response.data);
        } else {
          this.reviews[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          this.currentReview = null;
          return null;
        }
        this.error = error.response?.data?.message || 'Failed to fetch review';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviewById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await reviewsService.getById(id);
        this.currentReview = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch review';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async respondToReview(id: string, response: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const responseData = await reviewsService.respond(id, { response });
        const index = this.reviews.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reviews[index] = responseData.data;
        }
        if (this.currentReview?.id === id) {
          this.currentReview = responseData.data;
        }
        return responseData.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to respond to review';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteReview(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await reviewsService.delete(id);
        this.reviews = this.reviews.filter((r) => r.id !== id);
        if (this.currentReview?.id === id) {
          this.currentReview = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete review';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearCurrentReview() {
      this.currentReview = null;
    },
  },
});
