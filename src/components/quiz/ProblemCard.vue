<template>
  <NeoCard class="problem-card">
    <div class="space-y-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <span
              class="px-3 py-1 border-2 border-black rounded-lg font-bold text-xs uppercase"
              :class="typeColorClass"
            >
              {{ typeLabel }}
            </span>
            <span class="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg font-bold text-xs">
              {{ problem.points }} {{ problem.points === 1 ? 'point' : 'points' }}
            </span>
          </div>
          <p class="text-gray-900 font-bold line-clamp-2">
            {{ problem.questionText }}
          </p>
        </div>
      </div>

      <div v-if="problem.questionType === 'multiple_choice' && problem.choices" class="space-y-1">
        <p class="text-xs font-bold text-gray-600 uppercase">Choices:</p>
        <div class="grid grid-cols-1 gap-1">
          <p
            v-for="(choice, index) in problem.choices"
            :key="index"
            class="text-sm text-gray-700"
            :class="{ 'font-black text-success-600': choice === problem.answerText }"
          >
            {{ choice }}
          </p>
        </div>
      </div>

      <div v-else-if="showAnswer" class="border-l-4 border-success-500 pl-3 py-2">
        <p class="text-xs font-bold text-success-700 uppercase mb-1">Answer:</p>
        <p class="text-sm text-gray-700">{{ problem.answerText }}</p>
      </div>

      <div v-if="showActions" class="flex space-x-2 pt-4 border-t-2 border-gray-200">
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
        <NeoButton
          v-if="!selected"
          variant="primary"
          size="sm"
          @click="handleSelect"
        >
          Select
        </NeoButton>
        <NeoButton
          v-else
          variant="success"
          size="sm"
          @click="handleDeselect"
        >
          ✓ Selected
        </NeoButton>
      </div>
    </div>
  </NeoCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { NeoCard, NeoButton } from '@/components/common/ui';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface Problem {
  id: string;
  questionText: string;
  answerText: string;
  questionType: QuestionType;
  choices?: string[];
  points: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default defineComponent({
  name: 'ProblemCard',
  components: { NeoCard, NeoButton },
  props: {
    problem: {
      type: Object as PropType<Problem>,
      required: true,
    },
    showAnswer: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    typeLabel(): string {
      const labels: Record<QuestionType, string> = {
        multiple_choice: 'Multiple Choice',
        essay: 'Essay',
        short_answer: 'Short Answer',
      };
      return labels[this.problem.questionType] || this.problem.questionType;
    },

    typeColorClass(): string {
      const colors: Record<QuestionType, string> = {
        multiple_choice: 'bg-primary-100 text-primary-700',
        essay: 'bg-warning-100 text-warning-700',
        short_answer: 'bg-success-100 text-success-700',
      };
      return colors[this.problem.questionType] || 'bg-gray-100 text-gray-700';
    },
  },
  methods: {
    handleEdit(): void {
      this.$emit('edit', this.problem);
    },

    handleDelete(): void {
      this.$emit('delete', this.problem.id);
    },

    handleSelect(): void {
      this.$emit('select', this.problem);
    },

    handleDeselect(): void {
      this.$emit('deselect', this.problem.id);
    },
  },
  emits: ['edit', 'delete', 'select', 'deselect'],
});
</script>

<style scoped>
.problem-card {
  transition: transform 0.2s ease-in-out;
}

.problem-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
