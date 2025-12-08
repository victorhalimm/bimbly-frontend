<template>
  <div class="bg-white rounded-[2.5rem] p-8 hover:scale-105 transition-all shadow-lg hover:shadow-xl cursor-pointer relative overflow-hidden">
    <div class="absolute -top-4 -right-4 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-2xl"></div>

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-black text-gray-900">{{ subject.name }}</h3>
        <div class="flex gap-2">
          <button
            @click="$emit('edit')"
            class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            aria-label="Edit report"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="$emit('delete')"
            class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
            aria-label="Delete report"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-semibold text-gray-500">Average Score</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-black text-blue-600">{{ averageScore.toFixed(1) }}</span>
          <span class="text-lg font-medium text-gray-500">/100</span>
        </div>
      </div>

      <div class="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="progressColor"
          :style="{ width: `${averageScore}%` }"
        ></div>
      </div>

      <div class="space-y-2">
        <div v-for="(score, subtopic) in subject.subtopicScores" :key="subtopic" class="flex justify-between items-center text-sm">
          <span class="font-medium text-gray-700">{{ subtopic }}</span>
          <span class="font-bold text-gray-900">{{ score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface SubjectData {
  id: string;
  name: string;
  subtopicScores: Record<string, number>;
  averageScore: number;
}

export default defineComponent({
  name: 'SubjectCard',
  props: {
    subject: {
      type: Object as () => SubjectData,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  computed: {
    averageScore(): number {
      return this.subject.averageScore || 0;
    },
    progressColor(): string {
      if (this.averageScore >= 80) return 'bg-green-500';
      if (this.averageScore >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    },
  },
});
</script>

<style scoped>
</style>
