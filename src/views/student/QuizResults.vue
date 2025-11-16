<template>
  <div class="quiz-results-page p-6 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">Quiz Results</h1>
      <p class="text-gray-600 mt-2">Review your performance and feedback</p>
    </div>

    <div v-if="quizAssignmentsStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading results...</p>
    </div>

    <div v-else-if="quizAssignmentsStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ quizAssignmentsStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="quizResults" class="space-y-6">
      <NeoCard class="bg-primary-50">
        <div class="text-center py-6">
          <p class="text-sm font-bold text-gray-700 uppercase mb-2">Your Score</p>
          <p class="text-6xl font-black mb-2" :class="scoreColorClass">
            {{ finalScore }}%
          </p>
          <p class="text-lg text-gray-600">
            {{ totalEarned }} / {{ totalPoints }} points
          </p>
          <p class="text-sm text-gray-500 mt-4">
            Submitted on {{ formattedSubmittedDate }}
          </p>
        </div>
      </NeoCard>

      <NeoCard>
        <h2 class="text-2xl font-black text-gray-900 mb-4">Performance Summary</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 border-2 border-black rounded-xl">
            <p class="text-3xl font-black text-gray-900">{{ quizResults.answers.length }}</p>
            <p class="text-xs font-bold text-gray-600 uppercase mt-1">Total Questions</p>
          </div>
          <div class="text-center p-4 bg-success-50 border-2 border-black rounded-xl">
            <p class="text-3xl font-black text-success-600">{{ correctAnswers }}</p>
            <p class="text-xs font-bold text-gray-600 uppercase mt-1">Correct</p>
          </div>
          <div class="text-center p-4 bg-error-50 border-2 border-black rounded-xl">
            <p class="text-3xl font-black text-error-600">{{ incorrectAnswers }}</p>
            <p class="text-xs font-bold text-gray-600 uppercase mt-1">Incorrect</p>
          </div>
          <div class="text-center p-4 bg-warning-50 border-2 border-black rounded-xl">
            <p class="text-3xl font-black text-warning-600">{{ partialAnswers }}</p>
            <p class="text-xs font-bold text-gray-600 uppercase mt-1">Partial</p>
          </div>
        </div>
      </NeoCard>

      <div class="space-y-4">
        <h2 class="text-2xl font-black text-gray-900">Question Review</h2>
        <div
          v-for="(answer, index) in quizResults.answers"
          :key="answer.id"
          class="answer-review"
        >
          <NeoCard :class="getAnswerCardClass(answer)">
            <div class="space-y-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg font-bold text-xs">
                      Question {{ index + 1 }}
                    </span>
                    <span class="px-3 py-1 bg-primary-100 border-2 border-black rounded-lg font-bold text-xs text-primary-700">
                      {{ answer.problem.points }} pts
                    </span>
                    <span
                      v-if="answer.isCorrect !== null"
                      class="px-3 py-1 border-2 border-black rounded-lg font-bold text-xs"
                      :class="answer.isCorrect ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'"
                    >
                      {{ answer.isCorrect ? '✓ Correct' : '✗ Incorrect' }}
                    </span>
                  </div>
                  <p class="text-lg font-bold text-gray-900">{{ answer.questionText }}</p>
                </div>
                <div class="text-right ml-4">
                  <p class="text-2xl font-black" :class="getScoreColor(answer.pointsEarned, answer.problem.points)">
                    {{ answer.pointsEarned }}
                  </p>
                  <p class="text-xs text-gray-600">/ {{ answer.problem.points }}</p>
                </div>
              </div>

              <div class="border-l-4 border-primary-500 pl-4 py-2">
                <p class="text-xs font-bold text-primary-700 uppercase mb-1">Your Answer:</p>
                <p class="text-gray-900 font-bold">{{ answer.studentAnswer }}</p>
              </div>

              <div v-if="answer.problem.questionType === 'multiple_choice'" class="border-l-4 border-success-500 pl-4 py-2">
                <p class="text-xs font-bold text-success-700 uppercase mb-1">Correct Answer:</p>
                <p class="text-gray-700">{{ getCorrectAnswer(answer.problem.id) }}</p>
              </div>

              <div v-if="answer.tutorFeedback" class="bg-gray-50 border-4 border-black rounded-xl p-4">
                <div class="flex items-start space-x-2">
                  <div class="w-8 h-8 bg-success-500 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-black text-sm">T</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-bold text-gray-600 uppercase mb-1">Tutor Feedback</p>
                    <p class="text-gray-700">{{ answer.tutorFeedback }}</p>
                  </div>
                </div>
              </div>
            </div>
          </NeoCard>
        </div>
      </div>

      <div class="flex justify-center space-x-4">
        <NeoButton variant="primary" @click="goBackToDashboard">
          Back to Quizzes
        </NeoButton>
        <NeoButton variant="secondary" @click="printResults">
          Print Results
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoAlert } from '@/components/common/ui';
import { useQuizAssignmentsStore } from '@/stores/quizAssignments.store';
import { useProblemsStore } from '@/stores/problems.store';
import { useRouter, useRoute } from 'vue-router';

interface Problem {
  id: string;
  questionType: string;
  points: number;
}

interface Answer {
  id: string;
  problem: Problem;
  questionText: string;
  studentAnswer: string;
  isCorrect: boolean | null;
  pointsEarned: number;
  tutorFeedback?: string;
}

export default defineComponent({
  name: 'QuizResults',
  components: { NeoCard, NeoButton, NeoAlert },
  computed: {
    quizAssignmentsStore() {
      return useQuizAssignmentsStore();
    },

    problemsStore() {
      return useProblemsStore();
    },

    quizResults() {
      return this.quizAssignmentsStore.quizResults;
    },

    totalPoints(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.reduce((sum, a) => sum + a.problem.points, 0);
    },

    totalEarned(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    },

    finalScore(): string {
      if (!this.totalPoints) return '0';
      return ((this.totalEarned / this.totalPoints) * 100).toFixed(2);
    },

    scoreColorClass(): string {
      const score = parseFloat(this.finalScore);
      if (score >= 85) return 'text-success-600';
      if (score >= 70) return 'text-primary-600';
      if (score >= 60) return 'text-warning-600';
      return 'text-error-600';
    },

    formattedSubmittedDate(): string {
      if (!this.quizResults?.assignment.submittedAt) return 'N/A';
      const date = new Date(this.quizResults.assignment.submittedAt);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    correctAnswers(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.filter((a) => a.isCorrect === true).length;
    },

    incorrectAnswers(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.filter((a) => a.isCorrect === false).length;
    },

    partialAnswers(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.filter((a) => {
        return a.isCorrect === null || (a.pointsEarned > 0 && a.pointsEarned < a.problem.points);
      }).length;
    },
  },
  async mounted() {
    const route = useRoute();
    const assignmentId = route.params.id as string;
    if (assignmentId) {
      await this.quizAssignmentsStore.fetchQuizResults(assignmentId);
      await this.problemsStore.fetchProblems();
    }
  },
  methods: {
    getAnswerCardClass(answer: Answer): string {
      if (answer.isCorrect === null) return '';
      return answer.isCorrect ? 'border-success-500' : 'border-error-500';
    },

    getScoreColor(earned: number, total: number): string {
      const percentage = (earned / total) * 100;
      if (percentage === 100) return 'text-success-600';
      if (percentage >= 50) return 'text-warning-600';
      return 'text-error-600';
    },

    getCorrectAnswer(problemId: string): string {
      const problem = this.problemsStore.getProblemById(problemId);
      return problem?.answerText || 'N/A';
    },

    goBackToDashboard() {
      const router = useRouter();
      router.push('/student/quizzes');
    },

    printResults() {
      window.print();
    },
  },
});
</script>

<style scoped>
@media print {
  .quiz-results-page {
    max-width: 100%;
  }
}
</style>
