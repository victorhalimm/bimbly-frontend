import { defineStore } from 'pinia';
import {
  reviewsService,
  type Review,
  type CreateReviewDto,
  type RespondReviewDto,
  type ReviewsResponse,
} from '../services/reviews.service';

interface ReviewsState {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  loading: boolean;
  error: string | null;
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    loading: false,
    error: null,
  }),

  getters: {
    reviewByBooking: (state) => (bookingId: string) => {
      return state.reviews.find((r) => r.bookingId === bookingId);
    },
  },

  actions: {
    async createReview(data: CreateReviewDto) {
      this.loading = true;
      this.error = null;
      try {
        const review = await reviewsService.create(data);
        this.reviews.unshift(review);
        return review;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchByTutor(tutorId: string, page: number = 1, limit: number = 10) {
      this.loading = true;
      this.error = null;
      try {
        const response: ReviewsResponse = await reviewsService.getByTutor(
          tutorId,
          page,
          limit,
        );
        if (page === 1) {
          this.reviews = response.data;
        } else {
          this.reviews.push(...response.data);
        }
        this.averageRating = response.meta.averageRating;
        this.totalReviews = response.meta.totalReviews;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch reviews';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchByBooking(bookingId: string) {
      this.loading = true;
      this.error = null;
      try {
        const review = await reviewsService.getByBooking(bookingId);
        const index = this.reviews.findIndex((r) => r.id === review.id);
        if (index === -1) {
          this.reviews.push(review);
        } else {
          this.reviews[index] = review;
        }
        return review;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async respondToReview(id: string, data: RespondReviewDto) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await reviewsService.respond(id, data);
        const index = this.reviews.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reviews[index] = updated;
        }
        return updated;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Failed to respond to review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReview(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await reviewsService.delete(id);
        this.reviews = this.reviews.filter((r) => r.id !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete review';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
