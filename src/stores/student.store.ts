import { defineStore } from 'pinia';
import { studentService } from '@/services/student.service';
import { userService } from '@/services/user.service';

export interface CurrentUserStudentProfile {
  id: string;
  currentGrade: number;
  schoolName: string;
  city: string;
  province: string;
  address?: string;
}

export interface StudentState {
  currentUserProfile: CurrentUserStudentProfile | null;
  loading: boolean;
  error: string | null;
}

export const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    currentUserProfile: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasProfile: (state) => state.currentUserProfile !== null,
  },

  actions: {
    async fetchCurrentUserProfile() {
      this.loading = true;
      this.error = null;
      try {
        const profile = await studentService.getProfile();
        this.currentUserProfile = profile;
        return profile;
      } catch (err: unknown) {
        const error = err as Error;
        this.error = error.message || 'Failed to fetch student profile';
        this.currentUserProfile = null;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentUserProfile() {
      this.currentUserProfile = null;
      this.error = null;
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
