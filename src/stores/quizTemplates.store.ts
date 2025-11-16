import { defineStore } from 'pinia';
import quizTemplatesService from '@/services/quiz-templates.service';

interface QuizTemplate {
  id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevels: number[];
  problemIds: string[];
  totalPoints: number;
  durationMinutes?: number;
  isPublic: boolean;
  timesUsed: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface QuizTemplatesState {
  templates: QuizTemplate[];
  currentTemplate: QuizTemplate | null;
  isLoading: boolean;
  error: string | null;
}

export const useQuizTemplatesStore = defineStore('quizTemplates', {
  state: (): QuizTemplatesState => ({
    templates: [],
    currentTemplate: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getTemplateById: (state) => (id: string) => {
      return state.templates.find((template) => template.id === id);
    },

    myTemplates: (state): QuizTemplate[] => {
      return state.templates.filter((template) => !template.isPublic);
    },

    publicTemplates: (state): QuizTemplate[] => {
      return state.templates.filter((template) => template.isPublic);
    },

    getTemplatesBySubject: (state) => (subject: string) => {
      return state.templates.filter((template) => template.subject === subject);
    },

    getTemplatesByGrade: (state) => (grade: number) => {
      return state.templates.filter((template) => template.gradeLevels.includes(grade));
    },
  },

  actions: {
    async fetchTemplates() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizTemplatesService.getAll();
        this.templates = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch templates';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTemplateById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizTemplatesService.getById(id);
        this.currentTemplate = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch template';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createTemplate(data: {
      title: string;
      description?: string;
      subject: string;
      gradeLevels: number[];
      problemIds: string[];
      durationMinutes?: number;
      isPublic?: boolean;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizTemplatesService.create(data);
        this.templates.push(response.data);
        this.currentTemplate = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create template';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateTemplate(id: string, data: Partial<{
      title: string;
      description: string;
      subject: string;
      gradeLevels: number[];
      problemIds: string[];
      durationMinutes: number;
      isPublic: boolean;
    }>) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizTemplatesService.update(id, data);
        const index = this.templates.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.templates[index] = response.data;
        }
        if (this.currentTemplate?.id === id) {
          this.currentTemplate = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update template';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async togglePublic(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizTemplatesService.togglePublic(id);
        const index = this.templates.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.templates[index] = response.data;
        }
        if (this.currentTemplate?.id === id) {
          this.currentTemplate = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to toggle public status';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteTemplate(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await quizTemplatesService.delete(id);
        this.templates = this.templates.filter((t) => t.id !== id);
        if (this.currentTemplate?.id === id) {
          this.currentTemplate = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete template';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearCurrentTemplate() {
      this.currentTemplate = null;
    },
  },
});
