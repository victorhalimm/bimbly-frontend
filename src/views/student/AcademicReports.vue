<template>
  <div class="academic-reports-page p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-black text-gray-900">Academic Reports</h1>
        <p class="text-gray-600 mt-2">Track your academic progress</p>
      </div>
      <NeoButton
        v-if="!showForm"
        variant="primary"
        @click="openAddForm"
      >
        + Add Report
      </NeoButton>
    </div>

    <div v-if="showForm" class="mb-8">
      <ReportForm
        :initial-data="editingReport"
        :is-edit="isEditMode"
        @submit="handleFormSubmit"
        @cancel="closeForm"
      />
    </div>

    <div v-if="!showForm" class="space-y-6">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-bold text-gray-700">Filter by Grade:</label>
        <NeoSelect
          v-model="selectedGrade"
          :options="gradeFilterOptions"
          placeholder="All grades"
        />
      </div>

      <div v-if="academicReportsStore.isLoading" class="text-center py-12">
        <p class="text-gray-500 font-bold">Loading reports...</p>
      </div>

      <div v-else-if="academicReportsStore.error" class="py-12">
        <NeoAlert variant="error">
          {{ academicReportsStore.error }}
        </NeoAlert>
      </div>

      <div v-else-if="filteredReports.length === 0" class="text-center py-12">
        <NeoCard>
          <div class="py-8">
            <p class="text-gray-500 font-bold text-lg mb-4">
              No academic reports yet
            </p>
            <NeoButton variant="primary" @click="openAddForm">
              Add Your First Report
            </NeoButton>
          </div>
        </NeoCard>
      </div>

      <div v-else>
        <div v-if="overallAverage > 0" class="mb-6">
          <NeoCard class="bg-primary-50">
            <div class="text-center py-4">
              <p class="text-sm font-bold text-gray-700 uppercase mb-2">
                Overall Average
              </p>
              <p class="text-5xl font-black text-primary-600">
                {{ overallAverage }}
              </p>
            </div>
          </NeoCard>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SubjectCard
            v-for="report in filteredReports"
            :key="report.id"
            :subject="report.subject"
            :grade="report.grade"
            :subtopic-scores="report.subtopicScores"
            :average-score="report.averageScore"
            @edit="openEditForm(report)"
            @delete="confirmDelete(report.id)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelDelete"
    >
      <NeoCard class="max-w-md w-full mx-4">
        <h3 class="text-2xl font-black text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete this academic report? This action cannot be undone.
        </p>
        <div class="flex space-x-4">
          <NeoButton
            variant="error"
            @click="handleDelete"
            :disabled="academicReportsStore.isLoading"
          >
            {{ academicReportsStore.isLoading ? 'Deleting...' : 'Delete' }}
          </NeoButton>
          <NeoButton
            variant="secondary"
            @click="cancelDelete"
            :disabled="academicReportsStore.isLoading"
          >
            Cancel
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoButton, NeoCard, NeoSelect, NeoAlert } from '@/components/common/ui';
import SubjectCard from '@/components/academic/SubjectCard.vue';
import ReportForm from '@/components/academic/ReportForm.vue';
import { useAcademicReportsStore } from '@/stores/academicReports.store';
import { useSubjectsStore } from '@/stores/subjects.store';

interface Subject {
  id: string;
  name: string;
}

interface SubtopicScores {
  [subtopic: string]: number;
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

interface ComponentData {
  showForm: boolean;
  isEditMode: boolean;
  editingReport: AcademicReport | null;
  selectedGrade: number | null;
  showDeleteConfirm: boolean;
  deletingReportId: string | null;
}

export default defineComponent({
  name: 'AcademicReports',
  components: { NeoButton, NeoCard, NeoSelect, NeoAlert, SubjectCard, ReportForm },
  data(): ComponentData {
    return {
      showForm: false,
      isEditMode: false,
      editingReport: null,
      selectedGrade: null,
      showDeleteConfirm: false,
      deletingReportId: null,
    };
  },
  computed: {
    academicReportsStore() {
      return useAcademicReportsStore();
    },

    subjectsStore() {
      return useSubjectsStore();
    },

    filteredReports(): AcademicReport[] {
      if (this.selectedGrade === null) {
        return this.academicReportsStore.reports;
      }
      return this.academicReportsStore.getReportsByGrade(this.selectedGrade);
    },

    gradeFilterOptions() {
      const options = [{ label: 'All Grades', value: null }];
      const grades = Array.from(
        new Set(this.academicReportsStore.reports.map((r) => r.grade))
      ).sort();
      grades.forEach((grade) => {
        options.push({ label: `Grade ${grade}`, value: grade });
      });
      return options;
    },

    overallAverage(): number {
      return this.academicReportsStore.overallAverage;
    },
  },
  async mounted() {
    await this.academicReportsStore.fetchReports();
    await this.subjectsStore.fetchSubjects();
  },
  methods: {
    openAddForm() {
      this.showForm = true;
      this.isEditMode = false;
      this.editingReport = null;
    },

    openEditForm(report: AcademicReport) {
      this.showForm = true;
      this.isEditMode = true;
      this.editingReport = report;
    },

    closeForm() {
      this.showForm = false;
      this.isEditMode = false;
      this.editingReport = null;
    },

    async handleFormSubmit(data: any) {
      try {
        if (this.isEditMode && this.editingReport) {
          await this.academicReportsStore.updateReport(
            this.editingReport.id,
            data
          );
        } else {
          await this.academicReportsStore.createReport(data);
        }
        this.closeForm();
      } catch (error) {
        console.error('Failed to save report:', error);
      }
    },

    confirmDelete(reportId: string) {
      this.deletingReportId = reportId;
      this.showDeleteConfirm = true;
    },

    cancelDelete() {
      this.deletingReportId = null;
      this.showDeleteConfirm = false;
    },

    async handleDelete() {
      if (!this.deletingReportId) return;

      try {
        await this.academicReportsStore.deleteReport(this.deletingReportId);
        this.cancelDelete();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    },
  },
});
</script>
