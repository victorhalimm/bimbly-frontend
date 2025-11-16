import { defineStore } from 'pinia';
import { sessionSummariesService } from '@/services/session-summaries.service';

interface SessionSummary {
  id: string;
  bookingId: string;
  strengths: string;
  areasForImprovement: string;
  notes?: string;
  homeworkAssigned?: string;
  nextSessionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionSummariesState {
  summaries: SessionSummary[];
  currentSummary: SessionSummary | null;
  isLoading: boolean;
  error: string | null;
}

export const useSessionSummariesStore = defineStore('sessionSummaries', {
  state: (): SessionSummariesState => ({
    summaries: [],
    currentSummary: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getSummaryByBookingId: (state) => (bookingId: string) => {
      return state.summaries.find((summary) => summary.bookingId === bookingId);
    },

    getSummaryById: (state) => (id: string) => {
      return state.summaries.find((summary) => summary.id === id);
    },
  },

  actions: {
    async createSummary(data: {
      bookingId: string;
      strengths: string;
      areasForImprovement: string;
      notes?: string;
      homeworkAssigned?: string;
      nextSessionPlan?: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.create(data);
        this.summaries.push(response.data);
        this.currentSummary = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create summary';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSummaryByBooking(bookingId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.getByBooking(bookingId);
        this.currentSummary = response.data;
        const index = this.summaries.findIndex((s) => s.bookingId === bookingId);
        if (index === -1) {
          this.summaries.push(response.data);
        } else {
          this.summaries[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summary';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSummariesByStudent(studentId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.getByStudent(studentId);
        this.summaries = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summaries';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSummariesByTutor(tutorId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.getByTutor(tutorId);
        this.summaries = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summaries';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSummaryById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.getById(id);
        this.currentSummary = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summary';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateSummary(id: string, data: Partial<{
      strengths: string;
      areasForImprovement: string;
      notes: string;
      homeworkAssigned: string;
      nextSessionPlan: string;
    }>) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await sessionSummariesService.update(id, data);
        const index = this.summaries.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.summaries[index] = response.data;
        }
        if (this.currentSummary?.id === id) {
          this.currentSummary = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update summary';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSummary(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await sessionSummariesService.delete(id);
        this.summaries = this.summaries.filter((s) => s.id !== id);
        if (this.currentSummary?.id === id) {
          this.currentSummary = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete summary';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
