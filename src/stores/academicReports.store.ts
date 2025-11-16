import { defineStore } from 'pinia';
import { academicReportsService } from '@/services/academic-reports.service';

interface SubtopicScores {
  [subtopic: string]: number;
}

interface Subject {
  id: string;
  name: string;
}

interface AcademicReport {
  id: string;
  studentId: string;
  grade: number;
  subject: Subject;
  subtopicScores: SubtopicScores;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

interface CurriculumTemplate {
  curriculum: string;
  grade: number;
  subjects: {
    name: string;
    subtopics: string[];
  }[];
}

interface AcademicReportsState {
  reports: AcademicReport[];
  currentReport: AcademicReport | null;
  curriculumTemplate: CurriculumTemplate | null;
  isLoading: boolean;
  error: string | null;
}

export const useAcademicReportsStore = defineStore('academicReports', {
  state: (): AcademicReportsState => ({
    reports: [],
    currentReport: null,
    curriculumTemplate: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getReportsByGrade: (state) => (grade: number) => {
      return state.reports.filter((report) => report.grade === grade);
    },

    getReportById: (state) => (id: string) => {
      return state.reports.find((report) => report.id === id);
    },

    overallAverage: (state): number => {
      if (state.reports.length === 0) return 0;
      const sum = state.reports.reduce((acc, report) => acc + report.averageScore, 0);
      return Math.round((sum / state.reports.length) * 10) / 10;
    },
  },

  actions: {
    async fetchReports() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await academicReportsService.getAll();
        this.reports = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch reports';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReportById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await academicReportsService.getById(id);
        this.currentReport = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch report';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createReport(data: {
      grade: number;
      subjectId: string;
      subtopicScores: SubtopicScores;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await academicReportsService.create(data);
        this.reports.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create report';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateReport(id: string, subtopicScores: SubtopicScores) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await academicReportsService.update(id, { subtopicScores });
        const index = this.reports.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reports[index] = response.data;
        }
        if (this.currentReport?.id === id) {
          this.currentReport = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update report';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteReport(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await academicReportsService.delete(id);
        this.reports = this.reports.filter((r) => r.id !== id);
        if (this.currentReport?.id === id) {
          this.currentReport = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete report';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurriculumTemplate(curriculum: string, grade: number) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await academicReportsService.getCurriculumTemplate(curriculum, grade);
        this.curriculumTemplate = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch curriculum template';
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
