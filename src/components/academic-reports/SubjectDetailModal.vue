<template>
  <div class="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-gray-900 mb-2">{{ report.subject }}</h2>
        <p class="text-gray-500 font-medium">Grade {{ report.grade }} - Detailed Progress</p>
      </div>
      <button
        @click="$emit('close')"
        class="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-blue-50 rounded-2xl p-6 text-center">
        <p class="text-sm font-semibold text-blue-600 mb-1">Average Score</p>
        <p class="text-4xl font-black text-blue-700">{{ report.averageScore.toFixed(1) }}</p>
      </div>
      <div class="bg-green-50 rounded-2xl p-6 text-center">
        <p class="text-sm font-semibold text-green-600 mb-1">Highest Score</p>
        <p class="text-4xl font-black text-green-700">{{ highestScore }}</p>
      </div>
      <div class="bg-yellow-50 rounded-2xl p-6 text-center">
        <p class="text-sm font-semibold text-yellow-600 mb-1">Needs Improvement</p>
        <p class="text-4xl font-black text-yellow-700">{{ lowestScore }}</p>
      </div>
    </div>

    <div class="bg-gray-50 rounded-2xl p-6 mb-8">
      <h3 class="text-xl font-black text-gray-900 mb-6">Subtopic Performance</h3>

      <div class="space-y-4">
        <div v-for="(score, subtopic) in sortedSubtopics" :key="subtopic" class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-700">{{ subtopic }}</span>
            <span class="font-black text-lg" :class="getScoreColor(score)">{{ score }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              :class="getBarColor(score)"
              :style="{ width: `${score}%` }"
            >
              <div class="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-xs text-gray-400">{{ getScoreLabel(score) }}</span>
            <span class="text-xs text-gray-400">{{ score }}/100</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-8">
      <h3 class="text-xl font-black text-gray-900 mb-4">Performance Distribution</h3>
      <div class="flex items-end justify-around h-40 gap-2">
        <div
          v-for="(score, subtopic) in report.subtopicScores"
          :key="String(subtopic)"
          class="flex flex-col items-center flex-1 max-w-[80px]"
        >
          <div
            class="w-full rounded-t-lg transition-all duration-500"
            :class="getBarColor(Number(score))"
            :style="{ height: `${Number(score) * 1.4}px` }"
          ></div>
          <p class="text-xs font-medium text-gray-600 mt-2 text-center truncate w-full" :title="String(subtopic)">
            {{ truncateSubtopic(String(subtopic)) }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        @click="$emit('close')"
        class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
      >
        Close
      </button>
      <button
        @click="$emit('edit', report)"
        class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
      >
        Edit Scores
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { AcademicReport } from '../../services/academic-reports.service';

export default defineComponent({
  name: 'SubjectDetailModal',
  props: {
    report: {
      type: Object as () => AcademicReport,
      required: true,
    },
  },
  emits: ['close', 'edit'],
  computed: {
    sortedSubtopics(): Record<string, number> {
      const entries = Object.entries(this.report.subtopicScores);
      entries.sort((a, b) => b[1] - a[1]);
      return Object.fromEntries(entries);
    },
    highestScore(): number {
      const scores = Object.values(this.report.subtopicScores);
      return scores.length > 0 ? Math.max(...scores) : 0;
    },
    lowestScore(): number {
      const scores = Object.values(this.report.subtopicScores);
      return scores.length > 0 ? Math.min(...scores) : 0;
    },
  },
  methods: {
    getScoreColor(score: number): string {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    },
    getBarColor(score: number): string {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    },
    getScoreLabel(score: number): string {
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Very Good';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Satisfactory';
      if (score >= 50) return 'Needs Work';
      return 'Needs Improvement';
    },
    truncateSubtopic(subtopic: string): string {
      if (subtopic.length > 10) {
        return subtopic.substring(0, 8) + '...';
      }
      return subtopic;
    },
  },
});
</script>
