import { defineStore } from 'pinia';
import problemsService from '@/services/problems.service';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface Problem {
  id: string;
  questionText: string;
  answerText: string;
  questionType: QuestionType;
  choices?: string[];
  points: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProblemsState {
  problems: Problem[];
  currentProblem: Problem | null;
  isLoading: boolean;
  error: string | null;
}

export const useProblemsStore = defineStore('problems', {
  state: (): ProblemsState => ({
    problems: [],
    currentProblem: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getProblemById: (state) => (id: string) => {
      return state.problems.find((problem) => problem.id === id);
    },

    getProblemsByType: (state) => (type: QuestionType) => {
      return state.problems.filter((problem) => problem.questionType === type);
    },

    multipleChoiceProblems: (state): Problem[] => {
      return state.problems.filter((p) => p.questionType === 'multiple_choice');
    },

    essayProblems: (state): Problem[] => {
      return state.problems.filter((p) => p.questionType === 'essay');
    },

    shortAnswerProblems: (state): Problem[] => {
      return state.problems.filter((p) => p.questionType === 'short_answer');
    },
  },

  actions: {
    async fetchProblems() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await problemsService.getAll();
        this.problems = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch problems';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProblemById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await problemsService.getById(id);
        this.currentProblem = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch problem';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createProblem(data: {
      questionText: string;
      answerText: string;
      questionType: QuestionType;
      choices?: string[];
      points?: number;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await problemsService.create(data);
        this.problems.push(response.data);
        this.currentProblem = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create problem';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProblem(id: string, data: Partial<{
      questionText: string;
      answerText: string;
      choices: string[];
      points: number;
    }>) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await problemsService.update(id, data);
        const index = this.problems.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.problems[index] = response.data;
        }
        if (this.currentProblem?.id === id) {
          this.currentProblem = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update problem';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteProblem(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await problemsService.delete(id);
        this.problems = this.problems.filter((p) => p.id !== id);
        if (this.currentProblem?.id === id) {
          this.currentProblem = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete problem';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearCurrentProblem() {
      this.currentProblem = null;
    },
  },
});
