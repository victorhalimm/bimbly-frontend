<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-[2rem] p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-gray-900">Session Summary</h3>
        <button
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div class="h-16 bg-gray-100 rounded-xl"></div>
        </div>
      </div>

      <div v-else-if="summary" class="space-y-5">
        <div class="flex gap-5">
          <div class="bg-green-50 rounded-xl p-4 flex-1/2">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="font-bold text-green-800">Strengths</h4>
            </div>
            <p class="text-green-700 whitespace-pre-wrap">{{ summary.strengths }}</p>
          </div>
  
          <div class="bg-yellow-50 rounded-xl p-4 flex-1/2">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 class="font-bold text-yellow-800">Areas for Improvement</h4>
            </div>
            <p class="text-yellow-700 whitespace-pre-wrap">{{ summary.areasForImprovement }}</p>
          </div>
        </div>

        <div v-if="summary.notes" class="bg-gray-50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 class="font-bold text-gray-800">Additional Notes</h4>
          </div>
          <p class="text-gray-700 whitespace-pre-wrap">{{ summary.notes }}</p>
        </div>

        <div v-if="summary.quizAssignment" class="bg-blue-50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h4 class="font-bold text-blue-800">Homework Quiz Assigned</h4>
            </div>
            <button
              v-if="viewAs === 'student'"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 hover:scale-105 transition-all"
              @click="goToQuiz"
            >
              Take Quiz
            </button>
          </div>
          <div class="text-blue-700">
            <p class="font-medium">{{ summary.quizAssignment.quizTemplate?.title || 'Quiz' }}</p>
            <p v-if="summary.quizAssignment.deadline" class="text-sm mt-1">
              Deadline: {{ formatDeadline(summary.quizAssignment.deadline) }}
            </p>
          </div>
        </div>

        <div v-if="summary.nextSessionPlan" class="bg-purple-50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 class="font-bold text-purple-800">Next Session Plan</h4>
          </div>
          <p class="text-purple-700 whitespace-pre-wrap">{{ summary.nextSessionPlan }}</p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-gray-500">No session summary available</p>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100">
        <button
          class="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { SessionSummary } from '@/services/session-summaries.service';

export default defineComponent({
  name: 'ViewSessionSummaryModal',
  props: {
    summary: {
      type: Object as () => SessionSummary | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    viewAs: {
      type: String as () => 'student' | 'tutor',
      default: 'student',
    },
  },
  emits: ['close'],
  methods: {
    formatDeadline(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    },
    goToQuiz() {
      if (this.summary?.quizAssignment?.id) {
        this.$emit('close');
        this.$router.push(`/student/quiz/${this.summary.quizAssignment.id}`);
      }
    },
  },
});
</script>
