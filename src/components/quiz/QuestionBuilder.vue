<template>
  <div class="bg-blue-50 rounded-2xl p-6 mb-4">
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-lg font-bold text-gray-900">Question {{ index + 1 }}</h4>
      <button
        type="button"
        @click="$emit('remove')"
        class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
        aria-label="Remove question"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label :for="`question-type-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
          Question Type
        </label>
        <select
          :id="`question-type-${index}`"
          v-model="localQuestion.questionType"
          @change="onTypeChange"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="short_answer">Short Answer</option>
          <option value="essay">Essay</option>
        </select>
      </div>

      <div>
        <label :for="`question-text-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
          Question
        </label>
        <textarea
          :id="`question-text-${index}`"
          v-model="localQuestion.questionText"
          @input="emitUpdate"
          required
          rows="3"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
          placeholder="Enter the question"
        ></textarea>
      </div>

      <div v-if="localQuestion.questionType === 'multiple_choice'" class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700">Choices</label>
        <div v-for="(choice, i) in localQuestion.choices" :key="i" class="flex gap-2">
          <input
            v-model="localQuestion.choices![i]"
            @input="emitUpdate"
            type="text"
            :placeholder="`Choice ${String.fromCharCode(65 + i)}`"
            required
            class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
          <button
            v-if="localQuestion.choices!.length > 2"
            type="button"
            @click="removeChoice(i)"
            class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          @click="addChoice"
          class="w-full py-2 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-200"
        >
          + Add Choice
        </button>
      </div>

      <div>
        <label :for="`answer-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
          {{ localQuestion.questionType === 'essay' ? 'Sample Answer' : 'Correct Answer' }}
        </label>
        <input
          v-if="localQuestion.questionType === 'multiple_choice'"
          :id="`answer-${index}`"
          v-model="localQuestion.answerText"
          @input="emitUpdate"
          type="text"
          required
          placeholder="e.g., A. Option 1"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
        <textarea
          v-else
          :id="`answer-${index}`"
          v-model="localQuestion.answerText"
          @input="emitUpdate"
          required
          rows="2"
          :placeholder="localQuestion.questionType === 'essay' ? 'Provide a sample answer for reference' : 'Enter the correct answer'"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
        ></textarea>
      </div>

      <div>
        <label :for="`points-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
          Points
        </label>
        <input
          :id="`points-${index}`"
          v-model.number="localQuestion.points"
          @input="emitUpdate"
          type="number"
          min="1"
          required
          class="w-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { QuizQuestion } from '../../services/quiz-templates.service';

export default defineComponent({
  name: 'QuestionBuilder',
  props: {
    question: {
      type: Object as () => QuizQuestion,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['update', 'remove'],
  data() {
    return {
      localQuestion: { ...this.question } as QuizQuestion,
    };
  },
  methods: {
    onTypeChange() {
      if (this.localQuestion.questionType === 'multiple_choice') {
        this.localQuestion.choices = this.localQuestion.choices || ['', '', '', ''];
      } else {
        delete this.localQuestion.choices;
      }
      this.emitUpdate();
    },
    addChoice() {
      if (!this.localQuestion.choices) {
        this.localQuestion.choices = [];
      }
      this.localQuestion.choices.push('');
      this.emitUpdate();
    },
    removeChoice(index: number) {
      if (this.localQuestion.choices) {
        this.localQuestion.choices.splice(index, 1);
        this.emitUpdate();
      }
    },
    emitUpdate() {
      this.$emit('update', { ...this.localQuestion });
    },
  },
});
</script>

<style scoped>
</style>
