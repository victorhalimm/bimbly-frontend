<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Grade <span class="text-blue-600">Quiz</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Review and grade student answers</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading submission...</p>
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
        <div class="bg-white rounded-[2.5rem] p-6 shadow-lg mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-gray-900 mb-1">
                {{ assignment?.quizTemplate?.title || 'Quiz' }}
              </h2>
              <p class="text-gray-600">
                Student: {{ assignment?.student?.user?.name || 'Unknown' }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-sm text-gray-500">Current Score</p>
                <p class="text-2xl font-black text-blue-600">{{ currentScore }}/{{ totalPoints }}</p>
              </div>
              <div :class="getProgressClass()">
                {{ gradedCount }}/{{ answers.length }} graded
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            v-for="(answer, index) in answers"
            :key="`${answer.assignmentId}-${answer.questionIndex}`"
            class="bg-white rounded-[2rem] p-6 shadow-lg"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {{ index + 1 }}
                </span>
                <span :class="getQuestionTypeClass(answer.questionType)">
                  {{ formatQuestionType(answer.questionType) }}
                </span>
                <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {{ answer.questionPoints }} pts
                </span>
              </div>
              <div v-if="isAutoGraded(answer)" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-green-600 font-medium">Auto-graded</span>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ answer.questionText }}</h3>

              <div v-if="answer.questionType === 'multiple_choice' && answer.questionChoices" class="space-y-2 mb-4">
                <div
                  v-for="(choice, choiceIndex) in answer.questionChoices"
                  :key="choiceIndex"
                  :class="[
                    'px-4 py-2 rounded-xl',
                    choice === answer.correctAnswer ? 'bg-green-100 text-green-900' :
                    choice === answer.studentAnswer && choice !== answer.correctAnswer ? 'bg-red-100 text-red-900' :
                    'bg-gray-100 text-gray-700'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span v-if="choice === answer.studentAnswer" class="font-bold">
                      <svg v-if="answer.isCorrect" class="w-5 h-5 text-green-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <svg v-else class="w-5 h-5 text-red-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    {{ choice }}
                    <span v-if="choice === answer.correctAnswer" class="text-xs font-bold">(Correct)</span>
                  </div>
                </div>
              </div>

              <div v-else class="space-y-3">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-sm font-semibold text-gray-500 mb-1">Student's Answer:</p>
                  <p class="text-gray-900 whitespace-pre-wrap">{{ answer.studentAnswer || '(No answer provided)' }}</p>
                </div>
                <div v-if="answer.questionType !== 'essay'" class="bg-green-50 rounded-xl p-4">
                  <p class="text-sm font-semibold text-green-700 mb-1">Correct Answer:</p>
                  <p class="text-green-900">{{ answer.correctAnswer }}</p>
                </div>
              </div>
            </div>

            <div v-if="answer.questionType === 'essay'" class="border-t-2 border-gray-200 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label :for="`points-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
                    Points Earned (max {{ answer.questionPoints }})
                  </label>
                  <input
                    :id="`points-${index}`"
                    v-model.number="gradeData[index].pointsEarned"
                    type="number"
                    min="0"
                    :max="answer.questionPoints"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
              <div class="mb-4">
                <label :for="`feedback-${index}`" class="block text-sm font-semibold text-gray-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  :id="`feedback-${index}`"
                  v-model="gradeData[index].tutorFeedback"
                  rows="3"
                  placeholder="Provide feedback for the student"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                ></textarea>
              </div>
              <button
                @click="saveGrade(answer, index)"
                :disabled="gradingIndex === index"
                class="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ gradingIndex === index ? 'Saving...' : 'Save Grade' }}
              </button>
            </div>

            <div v-else class="border-t-2 border-gray-200 pt-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-500">Points:</span>
                  <span class="text-lg font-black" :class="answer.isCorrect ? 'text-green-600' : 'text-red-600'">
                    {{ answer.pointsEarned }}/{{ answer.questionPoints }}
                  </span>
                </div>
                <div v-if="answer.tutorFeedback" class="text-sm text-gray-600">
                  <span class="font-semibold">Feedback:</span> {{ answer.tutorFeedback }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-6 shadow-lg mt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-lg font-bold text-gray-900">Final Score: {{ currentScore }}/{{ totalPoints }}</p>
              <p class="text-gray-600">{{ gradedCount }}/{{ answers.length }} questions graded</p>
            </div>
            <div class="flex gap-4">
              <button
                @click="$router.back()"
                class="px-6 py-3 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                @click="completeGrading"
                :disabled="!allEssaysGraded || completing"
                class="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {{ completing ? 'Completing...' : 'Complete Grading' }}
              </button>
            </div>
          </div>
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
import { quizAssignmentsService } from '../../services/quiz-assignments.service';
import { useToast } from '@/composables/useToast';

interface GradeInput {
  pointsEarned: number;
  tutorFeedback: string;
}

interface ComponentData {
  gradeData: GradeInput[];
  gradingIndex: number | null;
  completing: boolean;
}

export default defineComponent({
  name: 'GradeQuiz',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data(): ComponentData {
    return {
      gradeData: [],
      gradingIndex: null,
      completing: false,
    };
  },
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
      return this.answers.reduce((sum, a) => sum + Number(a.pointsEarned || 0), 0);
    },
    gradedCount(): number {
      return this.answers.filter(a =>
        a.questionType !== 'essay' || (a.pointsEarned !== null && a.pointsEarned !== undefined)
      ).length;
    },
    allEssaysGraded(): boolean {
      return this.answers.every(a =>
        a.questionType !== 'essay' || (a.pointsEarned !== null && a.pointsEarned !== undefined)
      );
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
        this.initializeGradeData();
      } catch (error: any) {
        console.error('Failed to load data:', error);
      }
    },
    initializeGradeData() {
      this.gradeData = this.answers.map(a => ({
        pointsEarned: a.pointsEarned || 0,
        tutorFeedback: a.tutorFeedback || '',
      }));
    },
    isAutoGraded(answer: StudentAnswer): boolean {
      return answer.questionType !== 'essay';
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
    getProgressClass(): string {
      if (this.gradedCount === this.answers.length) {
        return 'px-4 py-2 bg-green-100 text-green-900 rounded-full font-bold';
      }
      return 'px-4 py-2 bg-yellow-100 text-yellow-900 rounded-full font-bold';
    },
    async saveGrade(answer: StudentAnswer, index: number) {
      this.gradingIndex = index;
      try {
        await this.store.gradeAnswer(
          answer.assignmentId,
          answer.questionIndex,
          {
            pointsEarned: this.gradeData[index].pointsEarned,
            tutorFeedback: this.gradeData[index].tutorFeedback || undefined,
          }
        );
        this.toast.success('Grade Saved', 'Grade has been saved successfully.');
      } catch (error: any) {
        this.toast.error('Failed to Save Grade', error.message || 'Failed to save grade');
      } finally {
        this.gradingIndex = null;
      }
    },
    async completeGrading() {
      if (!this.allEssaysGraded) {
        this.toast.warning('Incomplete Grading', 'Please grade all essay questions before completing');
        return;
      }

      this.completing = true;
      try {
        await quizAssignmentsService.updateScore(this.assignmentId, this.currentScore);
        this.toast.success('Grading Completed', 'Quiz grading has been completed successfully!');
        this.$router.push('/tutor/assignments');
      } catch (error: any) {
        this.toast.error('Failed to Complete Grading', error.message || 'Failed to complete grading');
      } finally {
        this.completing = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
