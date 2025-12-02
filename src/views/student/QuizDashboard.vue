<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          My <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Quizzes</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Complete assigned quizzes and track your progress</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading quizzes...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="assignments.length === 0" class="text-center py-12">
        <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-600 mb-2">No quizzes assigned yet</p>
        <p class="text-gray-500">Check back later for new assignments!</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          class="bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-2xl font-black text-gray-900 mb-2">
                {{ assignment.quizTemplate?.title || 'Quiz' }}
              </h3>
              <p v-if="assignment.quizTemplate?.description" class="text-gray-600 mb-4">
                {{ assignment.quizTemplate.description }}
              </p>
              <div class="flex flex-wrap gap-3 mb-4">
                <span class="px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-sm">
                  {{ assignment.quizTemplate?.subject || 'N/A' }}
                </span>
                <span
                  class="px-4 py-2 rounded-full font-bold text-sm"
                  :class="getStatusColor(assignment.status)"
                >
                  {{ getStatusText(assignment.status) }}
                </span>
                <span v-if="assignment.deadline" class="px-4 py-2 bg-red-100 text-red-900 rounded-full font-bold text-sm">
                  Due: {{ formatDate(assignment.deadline) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex items-center gap-2 text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-medium">Assigned: {{ formatDate(assignment.assignedAt) }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="font-medium">{{ assignment.quizTemplate?.questions.length || 0 }} Questions</span>
            </div>
            <div v-if="assignment.score !== null && assignment.score !== undefined" class="flex items-center gap-2 text-green-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">Score: {{ assignment.score }}/{{ assignment.quizTemplate?.totalPoints || 0 }}</span>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              v-if="assignment.status === 'assigned' || assignment.status === 'in_progress'"
              @click="takeQuiz(assignment.id)"
              class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
            >
              {{ assignment.status === 'assigned' ? 'Start Quiz' : 'Continue Quiz' }}
            </button>
            <button
              v-else-if="assignment.status === 'graded'"
              @click="viewResults(assignment.id)"
              class="flex-1 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 hover:scale-105 transition-all shadow-lg"
            >
              View Results
            </button>
            <button
              v-else
              disabled
              class="flex-1 py-4 bg-gray-300 text-gray-600 rounded-full font-bold cursor-not-allowed"
            >
              Waiting for Grading
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';

export default defineComponent({
  name: 'QuizDashboard',
  computed: {
    store() {
      return useQuizStore();
    },
    assignments() {
      return this.store.assignments;
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
  },
  async mounted() {
    await this.store.fetchStudentAssignments();
  },
  methods: {
    getStatusText(status: string): string {
      const statusMap: Record<string, string> = {
        assigned: 'Not Started',
        in_progress: 'In Progress',
        submitted: 'Submitted',
        graded: 'Graded',
      };
      return statusMap[status] || status;
    },
    getStatusColor(status: string): string {
      const colorMap: Record<string, string> = {
        assigned: 'bg-gray-200 text-gray-900',
        in_progress: 'bg-yellow-100 text-yellow-900',
        submitted: 'bg-blue-100 text-blue-900',
        graded: 'bg-green-100 text-green-900',
      };
      return colorMap[status] || 'bg-gray-200 text-gray-900';
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    takeQuiz(assignmentId: string) {
      this.$router.push(`/student/quiz/${assignmentId}`);
    },
    viewResults(assignmentId: string) {
      this.$router.push(`/student/quiz/${assignmentId}/results`);
    },
  },
});
</script>

<style scoped>
</style>
