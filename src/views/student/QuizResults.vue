<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Quiz <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Results</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Review your performance and feedback</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading results...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
        <button
          @click="$router.back()"
          class="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>

      <template v-else>
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl mb-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-black text-gray-900 mb-2">
              {{ assignment?.quizTemplate?.title || 'Quiz' }}
            </h2>
            <p class="text-gray-600 mb-4">{{ assignment?.quizTemplate?.subject }}</p>
          </div>

          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="w-40 h-40 rounded-full border-8 flex items-center justify-center" :class="scoreRingClass">
                <div class="text-center">
                  <p class="text-4xl font-black" :class="scoreTextClass">{{ scorePercentage }}%</p>
                  <p class="text-sm text-gray-500">{{ currentScore }}/{{ totalPoints }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-green-50 rounded-2xl p-4">
              <p class="text-2xl font-black text-green-600">{{ correctCount }}</p>
              <p class="text-sm text-gray-600">Correct</p>
            </div>
            <div class="bg-red-50 rounded-2xl p-4">
              <p class="text-2xl font-black text-red-600">{{ incorrectCount }}</p>
              <p class="text-sm text-gray-600">Incorrect</p>
            </div>
            <div class="bg-blue-50 rounded-2xl p-4">
              <p class="text-2xl font-black text-blue-600">{{ answers.length }}</p>
              <p class="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-2xl font-black text-gray-900 mb-4">Question Review</h3>

          <div
            v-for="(answer, index) in answers"
            :key="`${answer.assignmentId}-${answer.questionIndex}`"
            class="bg-white rounded-[2rem] p-6 shadow-lg"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  :class="getQuestionScoreClass(answer)"
                >
                  {{ index + 1 }}
                </span>
                <span :class="getQuestionTypeClass(answer.questionType)">
                  {{ formatQuestionType(answer.questionType) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold" :class="answer.isCorrect || answer.pointsEarned === answer.questionPoints ? 'text-green-600' : 'text-red-600'">
                  {{ answer.pointsEarned || 0 }}/{{ answer.questionPoints }} pts
                </span>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-lg font-bold text-gray-900 mb-3">{{ answer.questionText }}</h4>

              <div v-if="answer.questionType === 'multiple_choice' && answer.questionChoices" class="space-y-2">
                <div
                  v-for="(choice, choiceIndex) in answer.questionChoices"
                  :key="choiceIndex"
                  :class="[
                    'px-4 py-3 rounded-xl flex items-center gap-3',
                    choice === answer.correctAnswer ? 'bg-green-100' :
                    choice === answer.studentAnswer && choice !== answer.correctAnswer ? 'bg-red-100' :
                    'bg-gray-50'
                  ]"
                >
                  <div class="flex-shrink-0">
                    <span v-if="choice === answer.correctAnswer" class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span v-else-if="choice === answer.studentAnswer" class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span v-else class="w-6 h-6 border-2 border-gray-300 rounded-full"></span>
                  </div>
                  <span :class="choice === answer.correctAnswer ? 'text-green-900 font-medium' : choice === answer.studentAnswer ? 'text-red-900' : 'text-gray-700'">
                    {{ choice }}
                  </span>
                </div>
              </div>

              <div v-else class="space-y-3">
                <div class="bg-blue-50 rounded-xl p-4">
                  <p class="text-sm font-semibold text-blue-700 mb-1">Your Answer:</p>
                  <p class="text-gray-900 whitespace-pre-wrap">{{ answer.studentAnswer || '(No answer provided)' }}</p>
                </div>
                <div v-if="answer.questionType !== 'essay'" class="bg-green-50 rounded-xl p-4">
                  <p class="text-sm font-semibold text-green-700 mb-1">Correct Answer:</p>
                  <p class="text-green-900">{{ answer.correctAnswer }}</p>
                </div>
              </div>
            </div>

            <div v-if="answer.tutorFeedback" class="bg-yellow-50 rounded-xl p-4 mt-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div>
                  <p class="text-sm font-semibold text-yellow-700 mb-1">Tutor Feedback:</p>
                  <p class="text-gray-900">{{ answer.tutorFeedback }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <button
            @click="$router.push('/student/quizzes')"
            class="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Quizzes
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import type { QuizAssignment } from '../../services/quiz-assignments.service';
import type { StudentAnswer } from '../../services/student-answers.service';

export default defineComponent({
  name: 'QuizResults',
  computed: {
    store() {
      return useQuizStore();
    },
    assignmentId(): string {
      return this.$route.params.id as string;
    },
    assignment(): QuizAssignment | null {
      return this.store.currentAssignment;
    },
    answers(): StudentAnswer[] {
      return this.store.answersByAssignment(this.assignmentId);
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
    totalPoints(): number {
      return this.answers.reduce((sum, a) => sum + a.questionPoints, 0);
    },
    currentScore(): number {
      return this.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
    },
    scorePercentage(): number {
      if (this.totalPoints === 0) return 0;
      return Math.round((this.currentScore / this.totalPoints) * 100);
    },
    correctCount(): number {
      return this.answers.filter(a => a.isCorrect || a.pointsEarned === a.questionPoints).length;
    },
    incorrectCount(): number {
      return this.answers.filter(a => !a.isCorrect && a.pointsEarned !== a.questionPoints).length;
    },
    scoreRingClass(): string {
      if (this.scorePercentage >= 80) return 'border-green-500';
      if (this.scorePercentage >= 60) return 'border-yellow-500';
      return 'border-red-500';
    },
    scoreTextClass(): string {
      if (this.scorePercentage >= 80) return 'text-green-600';
      if (this.scorePercentage >= 60) return 'text-yellow-600';
      return 'text-red-600';
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        await this.store.fetchAssignment(this.assignmentId);
        await this.store.fetchAnswers(this.assignmentId);
      } catch (error: any) {
        console.error('Failed to load results:', error);
      }
    },
    formatQuestionType(type: string): string {
      const types: Record<string, string> = {
        multiple_choice: 'Multiple Choice',
        short_answer: 'Short Answer',
        essay: 'Essay',
      };
      return types[type] || type;
    },
    getQuestionTypeClass(type: string): string {
      const classes: Record<string, string> = {
        multiple_choice: 'px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-bold',
        short_answer: 'px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-bold',
        essay: 'px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full text-sm font-bold',
      };
      return classes[type] || 'px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-bold';
    },
    getQuestionScoreClass(answer: StudentAnswer): string {
      if (answer.isCorrect || answer.pointsEarned === answer.questionPoints) {
        return 'bg-green-500 text-white';
      }
      if (answer.pointsEarned && answer.pointsEarned > 0) {
        return 'bg-yellow-500 text-white';
      }
      return 'bg-red-500 text-white';
    },
  },
});
</script>

<style scoped>
</style>
