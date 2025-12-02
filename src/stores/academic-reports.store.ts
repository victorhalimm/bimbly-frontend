import { defineStore } from 'pinia';
import {
  academicReportsService,
  type AcademicReport,
  type CreateAcademicReportDto,
  type UpdateAcademicReportDto,
  type CurriculumTemplate,
} from '../services/academic-reports.service';
import { subjectsService } from '../services/subjects.service';

interface AcademicReportsState {
  reports: AcademicReport[];
  subjects: Array<{ id: string; name: string }>;
  loading: boolean;
  error: string | null;
}

export const useAcademicReportsStore = defineStore('academicReports', {
  state: (): AcademicReportsState => ({
    reports: [],
    subjects: [],
    loading: false,
    error: null,
  }),

  getters: {
    reportsByGrade: (state) => (grade: number) => {
      return state.reports.filter((r) => r.grade === grade);
    },
    reportBySubject: (state) => (grade: number, subjectId: string) => {
      return state.reports.find(
        (r) => r.grade === grade && r.subjectId === subjectId,
      );
    },
  },

  actions: {
    async fetchReports() {
      this.loading = true;
      this.error = null;
      try {
        this.reports = await academicReportsService.getAll();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch reports';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSubjects() {
      try {
        this.subjects = await subjectsService.getAll();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch subjects';
        throw error;
      }
    },

    async createReport(data: CreateAcademicReportDto) {
      this.loading = true;
      this.error = null;
      try {
        const report = await academicReportsService.create(data);
        this.reports.push(report);
        return report;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create report';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateReport(id: string, data: UpdateAcademicReportDto) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await academicReportsService.update(id, data);
        const index = this.reports.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reports[index] = updated;
        }
        return updated;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update report';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReport(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await academicReportsService.delete(id);
        this.reports = this.reports.filter((r) => r.id !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete report';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getCurriculumTemplate(
      curriculum: string,
      grade: number,
    ): Promise<CurriculumTemplate> {
      try {
        return await academicReportsService.getCurriculumTemplate(
          curriculum,
          grade,
        );
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Failed to fetch curriculum template';
        throw error;
      }
    },
  },
});
