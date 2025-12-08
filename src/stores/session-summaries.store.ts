import { defineStore } from 'pinia';
import {
  sessionSummariesService,
  type SessionSummary,
  type CreateSessionSummaryDto,
  type UpdateSessionSummaryDto,
} from '../services/session-summaries.service';

interface SessionSummariesState {
  summaries: SessionSummary[];
  loading: boolean;
  error: string | null;
}

export const useSessionSummariesStore = defineStore('sessionSummaries', {
  state: (): SessionSummariesState => ({
    summaries: [],
    loading: false,
    error: null,
  }),

  getters: {
    summaryByBooking: (state) => (bookingId: string) => {
      return state.summaries.find((s) => s.bookingId === bookingId);
    },
  },

  actions: {
    async createSummary(data: CreateSessionSummaryDto) {
      this.loading = true;
      this.error = null;
      try {
        const summary = await sessionSummariesService.create(data);
        this.summaries.push(summary);
        return summary;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create summary';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchByBooking(bookingId: string) {
      this.loading = true;
      this.error = null;
      try {
        const summary = await sessionSummariesService.getByBooking(bookingId);
        const index = this.summaries.findIndex((s) => s.id === summary.id);
        if (index === -1) {
          this.summaries.push(summary);
        } else {
          this.summaries[index] = summary;
        }
        return summary;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summary';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchByStudent(studentId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.summaries = await sessionSummariesService.getByStudent(studentId);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summaries';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchByTutor(tutorId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.summaries = await sessionSummariesService.getByTutor(tutorId);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch summaries';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSummary(id: string, data: UpdateSessionSummaryDto) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await sessionSummariesService.update(id, data);
        const index = this.summaries.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.summaries[index] = updated;
        }
        return updated;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update summary';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSummary(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await sessionSummariesService.delete(id);
        this.summaries = this.summaries.filter((s) => s.id !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete summary';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
