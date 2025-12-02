<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Quiz <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Assignments</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Track and grade your students' quiz submissions</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div class="flex flex-wrap gap-2 justify-center mb-8">
        <button
          v-for="status in statusFilters"
          :key="status.value"
          @click="activeFilter = status.value"
          :class="[
            'px-6 py-3 rounded-full font-bold transition-all',
            activeFilter === status.value
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
          ]"
        >
          {{ status.label }}
          <span v-if="getCountByStatus(status.value) > 0" class="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-sm">
            {{ getCountByStatus(status.value) }}
          </span>
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading assignments...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="filteredAssignments.length === 0" class="text-center py-12">
        <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-600 mb-2">No assignments found</p>
        <p class="text-gray-500">{{ activeFilter === 'all' ? 'Assign quizzes to students to see them here' : 'No assignments with this status' }}</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="assignment in filteredAssignments"
          :key="assignment.id"
          class="bg-white rounded-[2rem] p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-xl font-black text-gray-900 mb-2">
                {{ assignment.quizTemplate?.title || 'Quiz' }}
              </h3>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-bold text-sm">
                  {{ assignment.quizTemplate?.subject || 'N/A' }}
                </span>
                <span :class="getStatusClass(assignment.status)">
                  {{ getStatusLabel(assignment.status) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ assignment.student?.user?.name || 'Student' }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Assigned: {{ formatDate(assignment.assignedAt) }}</span>
                </div>
                <div v-if="assignment.deadline" class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Due: {{ formatDate(assignment.deadline) }}</span>
                </div>
                <div v-if="assignment.score !== null && assignment.score !== undefined" class="flex items-center gap-1 text-green-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Score: {{ assignment.score }}/{{ assignment.quizTemplate?.totalPoints || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                v-if="assignment.status === 'submitted'"
                @click="gradeQuiz(assignment.id)"
                class="px-6 py-3 bg-yellow-500 text-white rounded-full font-bold hover:bg-yellow-600 hover:scale-105 transition-all shadow-lg"
              >
                Grade
              </button>
              <button
                v-else
                @click="viewDetails(assignment.id)"
                class="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import type { QuizAssignment } from '../../services/quiz-assignments.service';

interface StatusFilter {
  value: string;
  label: string;
}

interface ComponentData {
  activeFilter: string;
}

export default defineComponent({
  name: 'TutorAssignments',
  data(): ComponentData {
    return {
      activeFilter: 'all',
    };
  },
  computed: {
    store() {
      return useQuizStore();
    },
    assignments(): QuizAssignment[] {
      return this.store.assignments;
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
    statusFilters(): StatusFilter[] {
      return [
        { value: 'all', label: 'All' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'submitted', label: 'Needs Grading' },
        { value: 'graded', label: 'Graded' },
      ];
    },
    filteredAssignments(): QuizAssignment[] {
      if (this.activeFilter === 'all') {
        return this.assignments;
      }
      return this.assignments.filter(a => a.status === this.activeFilter);
    },
  },
  async mounted() {
    await this.store.fetchTutorAssignments();
  },
  methods: {
    getCountByStatus(status: string): number {
      if (status === 'all') {
        return this.assignments.length;
      }
      return this.assignments.filter(a => a.status === status).length;
    },
    getStatusLabel(status: string): string {
      const labels: Record<string, string> = {
        assigned: 'Not Started',
        in_progress: 'In Progress',
        submitted: 'Needs Grading',
        graded: 'Graded',
      };
      return labels[status] || status;
    },
    getStatusClass(status: string): string {
      const classes: Record<string, string> = {
        assigned: 'px-3 py-1 bg-gray-200 text-gray-900 rounded-full font-bold text-sm',
        in_progress: 'px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full font-bold text-sm',
        submitted: 'px-3 py-1 bg-orange-100 text-orange-900 rounded-full font-bold text-sm',
        graded: 'px-3 py-1 bg-green-100 text-green-900 rounded-full font-bold text-sm',
      };
      return classes[status] || 'px-3 py-1 bg-gray-200 text-gray-900 rounded-full font-bold text-sm';
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    gradeQuiz(assignmentId: string) {
      this.$router.push(`/tutor/assignments/${assignmentId}/grade`);
    },
    viewDetails(assignmentId: string) {
      this.$router.push(`/tutor/assignments/${assignmentId}`);
    },
  },
});
</script>

<style scoped>
</style>
