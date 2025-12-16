<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          My <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Academic</span> Progress
        </h1>
        <p class="text-lg font-medium text-gray-600">Track your learning journey across all subjects</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-xl mb-8">
        <div class="flex items-center justify-between mb-6">
          <label for="grade-select" class="text-lg font-bold text-gray-900">Select Grade Level</label>
          <button
            @click="showForm = true"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Report
          </button>
        </div>

        <select
          id="grade-select"
          v-model="selectedGrade"
          class="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium"
        >
          <option v-for="g in 12" :key="g" :value="g">Grade {{ g }}</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading reports...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="filteredReports.length === 0" class="text-center py-12">
        <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-600 mb-2">No reports for Grade {{ selectedGrade }}</p>
        <p class="text-gray-500">Add your first report to start tracking progress!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubjectCard
          v-for="report in filteredReports"
          :key="report.id"
          :subject="{
            name: report.subject,
            subtopicScores: report.subtopicScores,
            averageScore: report.averageScore,
          }"
          @edit="editReport(report)"
          @delete="deleteReport(report.id)"
        />
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="showForm = false">
      <div class="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ReportForm
          :report="editingReport"
          @cancel="closeForm"
          @success="onSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAcademicReportsStore } from '../../stores/academic-reports.store';
import SubjectCard from '../../components/academic-reports/SubjectCard.vue';
import ReportForm from '../../components/academic-reports/ReportForm.vue';
import type { AcademicReport } from '../../services/academic-reports.service';

export default defineComponent({
  name: 'AcademicReports',
  components: {
    SubjectCard,
    ReportForm,
  },
  data() {
    return {
      selectedGrade: 10,
      showForm: false,
      editingReport: null as AcademicReport | null,
    };
  },
  computed: {
    store() {
      return useAcademicReportsStore();
    },
    reports(): AcademicReport[] {
      return this.store.reports;
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
    filteredReports(): AcademicReport[] {
      return this.reports.filter((r) => r.grade === this.selectedGrade);
    },
  },
  async mounted() {
    await this.store.fetchReports();
  },
  methods: {
    editReport(report: AcademicReport) {
      this.editingReport = report;
      this.showForm = true;
    },
    async deleteReport(id: string) {
      if (!confirm('Are you sure you want to delete this report?')) return;

      try {
        await this.store.deleteReport(id);
      } catch (error: any) {
        alert(error.message || 'Failed to delete report');
      }
    },
    closeForm() {
      this.showForm = false;
      this.editingReport = null;
    },
    async onSuccess() {
      this.closeForm();
      await this.store.fetchReports();
    },
  },
});
</script>

<style scoped>
</style>
