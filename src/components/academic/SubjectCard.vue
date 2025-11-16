<template>
  <NeoCard class="subject-card">
    <div class="flex flex-col space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-2xl font-black text-gray-900">
            {{ subject.name }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Grade {{ grade }}
          </p>
        </div>
        <div class="flex flex-col items-end">
          <div class="text-4xl font-black" :class="scoreColorClass">
            {{ averageScore }}
          </div>
          <div class="text-xs font-bold text-gray-500 uppercase mt-1">
            Average
          </div>
        </div>
      </div>

      <div class="w-full bg-gray-200 rounded-full h-4 border-2 border-black overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="progressBarClass"
          :style="{ width: progressWidth }"
        ></div>
      </div>

      <div v-if="subtopics && subtopics.length > 0" class="space-y-2">
        <p class="text-xs font-bold text-gray-700 uppercase">Subtopics</p>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(score, topic) in displaySubtopics"
            :key="topic"
            class="text-sm"
          >
            <span class="font-bold text-gray-700">{{ topic }}:</span>
            <span class="ml-1 font-black" :class="getScoreColor(score as number)">
              {{ score }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex space-x-2 pt-2">
        <NeoButton
          variant="secondary"
          size="sm"
          @click="handleEdit"
        >
          Edit
        </NeoButton>
        <NeoButton
          variant="error"
          size="sm"
          @click="handleDelete"
        >
          Delete
        </NeoButton>
      </div>
    </div>
  </NeoCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { NeoCard, NeoButton } from '@/components/common/ui';

interface Subject {
  id: string;
  name: string;
}

interface SubtopicScores {
  [subtopic: string]: number;
}

export default defineComponent({
  name: 'SubjectCard',
  components: { NeoCard, NeoButton },
  props: {
    subject: {
      type: Object as PropType<Subject>,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1 && value <= 12,
    },
    subtopicScores: {
      type: Object as PropType<SubtopicScores>,
      required: true,
    },
    averageScore: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 0 && value <= 100,
    },
  },
  computed: {
    subtopics(): Array<[string, number]> {
      return Object.entries(this.subtopicScores);
    },

    displaySubtopics(): SubtopicScores {
      return this.subtopicScores;
    },

    progressWidth(): string {
      return `${this.averageScore}%`;
    },

    scoreColorClass(): string {
      if (this.averageScore >= 85) return 'text-success-600';
      if (this.averageScore >= 70) return 'text-primary-600';
      if (this.averageScore >= 60) return 'text-warning-600';
      return 'text-error-600';
    },

    progressBarClass(): string {
      if (this.averageScore >= 85) return 'bg-success-500';
      if (this.averageScore >= 70) return 'bg-primary-500';
      if (this.averageScore >= 60) return 'bg-warning-500';
      return 'bg-error-500';
    },
  },
  methods: {
    getScoreColor(score: number): string {
      if (score >= 85) return 'text-success-600';
      if (score >= 70) return 'text-primary-600';
      if (score >= 60) return 'text-warning-600';
      return 'text-error-600';
    },

    handleEdit(): void {
      this.$emit('edit');
    },

    handleDelete(): void {
      this.$emit('delete');
    },
  },
  emits: ['edit', 'delete'],
});
</script>

<style scoped>
.subject-card {
  transition: transform 0.2s ease-in-out;
}

.subject-card:hover {
  transform: translateY(-2px);
}
</style>
