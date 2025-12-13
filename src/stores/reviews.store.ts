import { defineStore } from 'pinia';
import {
  reviewsService,
  type Review,
  type CreateReviewDto,
  type ReviewsResponse,
  type ReviewsMeta,
  type RatingDistribution,
  type SortBy,
} from '../services/reviews.service';

export interface ReviewsState {
  reviews: Review[];
  meta: ReviewsMeta | null;
  loading: boolean;
  error: string | null;
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    meta: null,
    loading: false,
    error: null,
  }),

  getters: {
    averageRating: (state): number => state.meta?.averageRating || 0,
    totalReviews: (state): number => state.meta?.totalReviews || 0,
    ratingDistribution: (state): RatingDistribution[] => state.meta?.ratingDistribution || [],
    hasNextPage: (state): boolean => state.meta?.hasNextPage || false,
    hasPrevPage: (state): boolean => state.meta?.hasPrevPage || false,
    currentPage: (state): number => state.meta?.currentPage || 1,
    totalPages: (state): number => state.meta?.totalPages || 1,
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

    async fetchByTutor(
      tutorId: string,
      page: number = 1,
      limit: number = 10,
      sortBy: SortBy = 'newest',
      rating?: number | null,
    ) {
      this.loading = true;
      this.error = null;
      try {
        const response: ReviewsResponse = await reviewsService.getByTutor(
          tutorId,
          page,
          limit,
          sortBy,
          rating,
        );
        this.reviews = response.data;
        this.meta = response.meta;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch reviews';
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
        this.reviews = this.reviews.filter((r) => r.reviewTitle !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearReviews() {
      this.reviews = [];
      this.meta = null;
      this.error = null;
    },
  },
});
