import { defineStore } from 'pinia';
import {
  tutorService,
  type TutorSearchFilters,
  type TutorListItem,
  type TutorProfile,
  type PaginationMeta,
  type ReviewsResponse,
  type AvailabilityResponse,
} from '@/services/tutor.service';
import { userService } from '@/services/user.service';

export interface TutorState {
  tutors: TutorListItem[];
  selectedTutor: TutorProfile | null;
  currentUserProfile: TutorProfile | null;
  filters: TutorSearchFilters;
  meta: PaginationMeta;
  reviews: ReviewsResponse | null;
  availability: AvailabilityResponse | null;
  loading: boolean;
  error: string | null;
}

export const useTutorStore = defineStore('tutor', {
  state: (): TutorState => ({
    tutors: [],
    selectedTutor: null,
    currentUserProfile: null,
    filters: {
      sortBy: 'rating',
      order: 'DESC',
      page: 1,
      limit: 20,
    },
    meta: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    reviews: null,
    availability: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasResults: (state) => state.tutors.length > 0,
    hasMorePages: (state) => state.meta.page < state.meta.totalPages,
    currentPage: (state) => state.meta.page,
    totalPages: (state) => state.meta.totalPages,
    totalResults: (state) => state.meta.total,
    isCurrentUserApproved: (state) => state.currentUserProfile?.isApproved ?? false,
  },

  actions: {
    async searchTutors(newFilters?: Partial<TutorSearchFilters>) {
      this.loading = true;
      this.error = null;

      try {
        if (newFilters) {
          this.filters = { ...this.filters, ...newFilters };
        }

        const response = await tutorService.searchTutors(this.filters);
        this.tutors = response.data;
        this.meta = response.meta;
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to search tutors';
        this.tutors = [];
      } finally {
        this.loading = false;
      }
    },

    async getTutorById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        this.selectedTutor = await tutorService.getTutorById(id);
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to fetch tutor profile';
        this.selectedTutor = null;
      } finally {
        this.loading = false;
      }
    },

    async getTutorReviews(id: string, page: number = 1, limit: number = 10) {
      try {
        this.reviews = await tutorService.getTutorReviews(id, page, limit);
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to fetch reviews';
        this.reviews = null;
      }
    },

    async getTutorAvailability(id: string, date?: string) {
      try {
        this.availability = await tutorService.getTutorAvailability(id, date);
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to fetch availability';
        this.availability = null;
      }
    },

    setPage(page: number) {
      this.filters.page = page;
      this.searchTutors();
    },

    resetFilters() {
      this.filters = {
        sortBy: 'rating',
        order: 'DESC',
        page: 1,
        limit: 20,
      };
    },

    clearError() {
      this.error = null;
    },

    clearSelectedTutor() {
      this.selectedTutor = null;
      this.reviews = null;
      this.availability = null;
    },

    async fetchCurrentUserProfile() {
      try {
        const profile = await tutorService.getProfile();
        this.currentUserProfile = profile;
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to fetch tutor profile';
        this.currentUserProfile = null;
      }
    },

    clearCurrentUserProfile() {
      this.currentUserProfile = null;
    },

    async updateProfile(data: Record<string, unknown>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await userService.updateProfile(data);
        await this.fetchCurrentUserProfile();
        return response;
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to update profile';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
