<template>
  <div class="bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-black text-gray-900">Session Summary</h3>
      <div v-if="showActions" class="flex gap-2">
        <button
          @click="$emit('edit')"
          class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
          aria-label="Edit summary"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-green-50 rounded-2xl p-6">
        <h4 class="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Strengths
        </h4>
        <p class="text-gray-700 font-medium leading-relaxed">{{ summary.strengths }}</p>
      </div>

      <div class="bg-yellow-50 rounded-2xl p-6">
        <h4 class="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Areas for Improvement
        </h4>
        <p class="text-gray-700 font-medium leading-relaxed">{{ summary.areasForImprovement }}</p>
      </div>

      <div v-if="summary.notes" class="bg-blue-50 rounded-2xl p-6">
        <h4 class="text-lg font-bold text-blue-900 mb-3">Notes</h4>
        <p class="text-gray-700 font-medium leading-relaxed">{{ summary.notes }}</p>
      </div>

      <div v-if="summary.quizAssignment" class="bg-purple-50 rounded-2xl p-6">
        <h4 class="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Homework Quiz Assigned
        </h4>
        <p class="text-gray-700 font-medium leading-relaxed">{{ summary.quizAssignment.quizTemplate?.title || 'Quiz' }}</p>
        <p v-if="summary.quizAssignment.deadline" class="text-gray-500 text-sm mt-2">
          Deadline: {{ formatDate(summary.quizAssignment.deadline) }}
        </p>
      </div>

      <div v-if="summary.nextSessionPlan" class="bg-gray-50 rounded-2xl p-6">
        <h4 class="text-lg font-bold text-gray-900 mb-3">Next Session Plan</h4>
        <p class="text-gray-700 font-medium leading-relaxed">{{ summary.nextSessionPlan }}</p>
      </div>
    </div>

    <div class="mt-6 pt-6 border-t-2 border-gray-100">
      <p class="text-sm text-gray-500">
        Created {{ formatDate(summary.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { SessionSummary } from '../../services/session-summaries.service';

export default defineComponent({
  name: 'SummaryCard',
  props: {
    summary: {
      type: Object as () => SessionSummary,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit'],
  methods: {
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
});
</script>

<style scoped>
</style>
