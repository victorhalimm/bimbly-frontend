import { defineStore } from 'pinia';
import { subjectsService } from '@/services/subjects.service';

interface Subject {
  id: string;
  name: string;
  createdAt?: string;
}

interface SubjectsState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
}

export const useSubjectsStore = defineStore('subjects', {
  state: (): SubjectsState => ({
    subjects: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getSubjectById: (state) => (id: string) => {
      return state.subjects.find((subject) => subject.id === id);
    },

    getSubjectByName: (state) => (name: string) => {
      return state.subjects.find(
        (subject) => subject.name.toLowerCase() === name.toLowerCase()
      );
    },

    subjectNames: (state): string[] => {
      return state.subjects.map((subject) => subject.name);
    },
  },

  actions: {
    async fetchSubjects() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await subjectsService.getAll();
        this.subjects = response.data.data;
        return response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch subjects';
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
