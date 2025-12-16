<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-6 lg:px-12">
    <div class="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-96 h-96 bg-yellow-100 rounded-full opacity-15 blur-3xl"></div>

    <div class="relative z-10">
      <div v-if="loading" class="bg-white rounded-[2.5rem] shadow-xl p-12 text-center">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 font-medium">Loading your academic progress...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside class="lg:col-span-3">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 sticky top-8">
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden shadow-xl">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-blue-400">
                    <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="w-full pt-6 border-t-2 border-gray-100">
                <h2 class="text-xl font-black text-gray-900 mb-1">{{ studentName }}</h2>
                <p class="text-sm text-gray-500 font-medium">{{ studentEmail }}</p>
                <p class="text-sm text-blue-600 font-semibold mt-2">Grade {{ currentGrade }}</p>
              </div>

              <div class="w-full mt-6 pt-6 border-t-2 border-gray-100">
                <div class="bg-blue-50 rounded-2xl p-4 mb-4">
                  <p class="text-sm font-semibold text-gray-600 mb-1">Overall Average</p>
                  <p class="text-3xl font-black text-blue-600">{{ overallAverage.toFixed(1) }}</p>
                </div>
                <div class="bg-green-50 rounded-2xl p-4">
                  <p class="text-sm font-semibold text-gray-600 mb-1">Subjects Tracked</p>
                  <p class="text-3xl font-black text-green-600">{{ filteredReports.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <div class="space-y-8">
            <div class="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12">
              <div class="flex items-center gap-4 mb-8 pb-6 border-b-2 border-blue-50">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-3xl font-black text-gray-900">
                    My <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Academic</span> Progress
                  </h3>
                  <p class="text-gray-500 font-medium">Track your learning journey across all subjects</p>
                </div>
                <button
                  @click="showForm = true; editingReport = null"
                  class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Report
                </button>
              </div>

              <div class="mb-6">
                <label for="grade-select" class="block text-sm font-bold text-gray-700 mb-2">Filter by Grade Level</label>
                <select
                  id="grade-select"
                  v-model="selectedGrade"
                  class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
                >
                  <option v-for="g in 12" :key="g" :value="g">Grade {{ g }}</option>
                </select>
              </div>

              <div v-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl mb-6">
                <p class="font-medium">{{ error }}</p>
              </div>

              <div v-if="filteredReports.length === 0" class="text-center py-12">
                <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-xl font-bold text-gray-600 mb-2">No reports for Grade {{ selectedGrade }}</p>
                <p class="text-gray-500 mb-6">Add your first report to start tracking progress!</p>
                <button
                  @click="showForm = true; editingReport = null"
                  class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Report
                </button>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="report in filteredReports"
                  :key="report.id"
                  @click="openSubjectDetail(report)"
                  class="bg-white border-2 border-gray-100 rounded-[2rem] p-6 hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                >
                  <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-2xl"></div>

                  <div class="relative z-10">
                    <div class="flex items-start justify-between mb-4">
                      <h4 class="text-xl font-black text-gray-900">{{ report.subject }}</h4>
                      <div class="flex gap-2">
                        <button
                          @click.stop="editReport(report)"
                          class="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                          aria-label="Edit report"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click.stop="deleteReport(report.id)"
                          class="w-9 h-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                          aria-label="Delete report"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="flex items-baseline gap-2 mb-3">
                      <span class="text-3xl font-black" :class="getScoreColor(report.averageScore)">
                        {{ report.averageScore.toFixed(1) }}
                      </span>
                      <span class="text-lg font-medium text-gray-400">/100</span>
                    </div>

                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="getProgressBarColor(report.averageScore)"
                        :style="{ width: `${report.averageScore}%` }"
                      ></div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(score, subtopic) in getTopSubtopics(report.subtopicScores)"
                        :key="subtopic"
                        class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full"
                      >
                        {{ subtopic }}: {{ score }}
                      </span>
                      <span
                        v-if="Object.keys(report.subtopicScores).length > 3"
                        class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                      >
                        +{{ Object.keys(report.subtopicScores).length - 3 }} more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeForm">
      <div class="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <AcademicReportForm
          :report="editingReport"
          :default-grade="selectedGrade"
          @cancel="closeForm"
          @success="onFormSuccess"
        />
      </div>
    </div>

    <div v-if="selectedReport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeSubjectDetail">
      <SubjectDetailModal
        :report="selectedReport"
        @close="closeSubjectDetail"
        @edit="editReportFromModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAcademicReportsStore } from '../../stores/academic-reports.store';
import { useAuthStore } from '../../stores/auth.store';
import { useToast } from '../../composables/useToast';
import { studentService } from '../../services/student.service';
import AcademicReportForm from '../../components/academic-reports/AcademicReportForm.vue';
import SubjectDetailModal from '../../components/academic-reports/SubjectDetailModal.vue';
import type { AcademicReport } from '../../services/academic-reports.service';

interface StudentProfile {
  currentGrade: number;
  schoolName?: string;
  city?: string;
  province?: string;
}

export default defineComponent({
  name: 'StudentAcademicProgress',
  components: {
    AcademicReportForm,
    SubjectDetailModal,
  },
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    return { authStore, toast };
  },
  data() {
    return {
      selectedGrade: 10,
      showForm: false,
      editingReport: null as AcademicReport | null,
      selectedReport: null as AcademicReport | null,
      studentProfile: null as StudentProfile | null,
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
    studentName(): string {
      return this.authStore.user?.fullName || 'Student';
    },
    studentEmail(): string {
      return this.authStore.user?.email || '';
    },
    avatarUrl(): string | null {
      return this.authStore.user?.profileImageUrl || null;
    },
    currentGrade(): number {
      return this.studentProfile?.currentGrade || this.selectedGrade;
    },
    overallAverage(): number {
      if (this.filteredReports.length === 0) return 0;
      const sum = this.filteredReports.reduce((acc, r) => acc + r.averageScore, 0);
      return sum / this.filteredReports.length;
    },
  },
  async mounted() {
    await this.loadStudentProfile();
    await this.loadData();
  },
  methods: {
    async loadStudentProfile() {
      try {
        const profile = await studentService.getProfile();
        this.studentProfile = profile;
        if (profile?.currentGrade) {
          this.selectedGrade = profile.currentGrade;
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error('Failed to load student profile:', err);
        }
      }
    },
    async loadData() {
      try {
        await this.store.fetchReports();
      } catch (err: any) {
        this.toast.error('Load Failed', err.message || 'Failed to load academic data');
      }
    },
    getScoreColor(score: number): string {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    },
    getProgressBarColor(score: number): string {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    },
    getTopSubtopics(subtopicScores: Record<string, number>): Record<string, number> {
      const entries = Object.entries(subtopicScores).slice(0, 3);
      return Object.fromEntries(entries);
    },
    openSubjectDetail(report: AcademicReport) {
      this.selectedReport = report;
    },
    closeSubjectDetail() {
      this.selectedReport = null;
    },
    editReport(report: AcademicReport) {
      this.editingReport = report;
      this.showForm = true;
    },
    editReportFromModal(report: AcademicReport) {
      this.closeSubjectDetail();
      this.editReport(report);
    },
    async deleteReport(id: string) {
      if (!confirm('Are you sure you want to delete this report?')) return;

      try {
        await this.store.deleteReport(id);
        this.toast.success('Deleted', 'Academic report has been deleted');
      } catch (err: any) {
        this.toast.error('Delete Failed', err.message || 'Failed to delete report');
      }
    },
    closeForm() {
      this.showForm = false;
      this.editingReport = null;
    },
    async onFormSuccess() {
      this.closeForm();
      await this.store.fetchReports();
      this.toast.success(
        this.editingReport ? 'Updated!' : 'Created!',
        'Academic report has been saved successfully'
      );
    },
  },
});
</script>
