<template>
  <div class="take-quiz-page p-6 max-w-4xl mx-auto">
    <div v-if="quizAssignmentsStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading quiz...</p>
    </div>

    <div v-else-if="quizAssignmentsStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ quizAssignmentsStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="assignment" class="space-y-6">
      <NeoCard class="sticky top-0 z-10 bg-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-black text-gray-900">
              {{ assignment.quizTemplate.title }}
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ currentQuestionIndex + 1 }} / {{ problems.length }} questions
            </p>
          </div>
          <div class="text-right">
            <div v-if="assignment.quizTemplate.durationMinutes" class="text-2xl font-black text-primary-600">
              {{ timeRemaining }}
            </div>
            <p class="text-xs text-gray-600 uppercase">Time Remaining</p>
          </div>
        </div>
        <div class="mt-4 w-full bg-gray-200 rounded-full h-3 border-2 border-black overflow-hidden">
          <div
            class="h-full bg-primary-500 transition-all duration-300"
            :style="{ width: progressWidth }"
          ></div>
        </div>
      </NeoCard>

      <NeoCard v-if="currentProblem">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-3">
                <span class="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg font-bold text-sm">
                  Question {{ currentQuestionIndex + 1 }}
                </span>
                <span class="px-3 py-1 bg-primary-100 border-2 border-black rounded-lg font-bold text-sm text-primary-700">
                  {{ currentProblem.points }} {{ currentProblem.points === 1 ? 'point' : 'points' }}
                </span>
              </div>
              <p class="text-xl font-bold text-gray-900 leading-relaxed">
                {{ currentProblem.questionText }}
              </p>
            </div>
          </div>

          <div v-if="currentProblem.questionType === 'multiple_choice'" class="space-y-3">
            <label
              v-for="(choice, index) in currentProblem.choices"
              :key="index"
              class="flex items-start p-4 border-4 border-black rounded-xl cursor-pointer hover:bg-primary-50 transition-colors"
              :class="{ 'bg-primary-100': currentAnswer === choice }"
            >
              <input
                v-model="currentAnswer"
                type="radio"
                :value="choice"
                class="w-5 h-5 mt-1 border-2 border-black"
                @change="autoSaveAnswer"
              />
              <span class="ml-3 font-bold text-gray-900">{{ choice }}</span>
            </label>
          </div>

          <div v-else class="space-y-2">
            <NeoTextarea
              v-model="currentAnswer"
              :placeholder="currentProblem.questionType === 'essay' ? 'Write your essay answer here...' : 'Enter your answer'"
              :rows="currentProblem.questionType === 'essay' ? 10 : 4"
              @input="autoSaveAnswer"
            />
            <p class="text-xs text-gray-500">
              {{ currentAnswer.length }} characters
            </p>
          </div>

          <div class="flex justify-between pt-6 border-t-2 border-gray-200">
            <NeoButton
              v-if="currentQuestionIndex > 0"
              variant="secondary"
              @click="previousQuestion"
            >
              ← Previous
            </NeoButton>
            <div v-else></div>

            <NeoButton
              v-if="currentQuestionIndex < problems.length - 1"
              variant="primary"
              @click="nextQuestion"
            >
              Next →
            </NeoButton>
            <NeoButton
              v-else
              variant="success"
              @click="confirmSubmit"
            >
              Submit Quiz
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      <NeoCard class="bg-gray-50">
        <h3 class="text-lg font-black text-gray-900 mb-3">Question Navigator</h3>
        <div class="grid grid-cols-5 md:grid-cols-10 gap-2">
          <button
            v-for="(problem, index) in problems"
            :key="problem.id"
            @click="goToQuestion(index)"
            class="w-10 h-10 border-2 border-black rounded-lg font-bold text-sm transition-all"
            :class="getQuestionButtonClass(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </NeoCard>
    </div>

    <div
      v-if="showSubmitConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelSubmit"
    >
      <NeoCard class="max-w-md w-full mx-4">
        <h3 class="text-2xl font-black text-gray-900 mb-4">
          Submit Quiz?
        </h3>
        <p class="text-gray-700 mb-2">
          You have answered {{ answeredCount }} out of {{ problems.length }} questions.
        </p>
        <p class="text-gray-700 mb-6">
          Are you sure you want to submit? You won't be able to change your answers after submission.
        </p>
        <div class="flex space-x-4">
          <NeoButton
            variant="success"
            @click="handleSubmit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Submitting...' : 'Yes, Submit' }}
          </NeoButton>
          <NeoButton
            variant="secondary"
            @click="cancelSubmit"
            :disabled="isSubmitting"
          >
            Cancel
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoTextarea, NeoAlert } from '@/components/common/ui';
import { useQuizAssignmentsStore } from '@/stores/quizAssignments.store';
import { useProblemsStore } from '@/stores/problems.store';
import { useRouter, useRoute } from 'vue-router';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface Problem {
  id: string;
  questionText: string;
  questionType: QuestionType;
  choices?: string[];
  points: number;
}

interface ComponentData {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  currentAnswer: string;
  showSubmitConfirm: boolean;
  isSubmitting: boolean;
  timeRemaining: string;
  timer: number | null;
}

export default defineComponent({
  name: 'TakeQuiz',
  components: { NeoCard, NeoButton, NeoTextarea, NeoAlert },
  data(): ComponentData {
    return {
      currentQuestionIndex: 0,
      answers: {},
      currentAnswer: '',
      showSubmitConfirm: false,
      isSubmitting: false,
      timeRemaining: '',
      timer: null,
    };
  },
  computed: {
    quizAssignmentsStore() {
      return useQuizAssignmentsStore();
    },

    problemsStore() {
      return useProblemsStore();
    },

    assignment() {
      return this.quizAssignmentsStore.currentAssignment;
    },

    problems(): Problem[] {
      if (!this.assignment) return [];
      return this.problemsStore.problems.filter((p) =>
        this.assignment!.quizTemplate.problemIds?.includes(p.id)
      );
    },

    currentProblem(): Problem | null {
      return this.problems[this.currentQuestionIndex] || null;
    },

    progressWidth(): string {
      if (this.problems.length === 0) return '0%';
      return `${((this.currentQuestionIndex + 1) / this.problems.length) * 100}%`;
    },

    answeredCount(): number {
      return Object.keys(this.answers).filter((key) => this.answers[key].trim() !== '').length;
    },
  },
  async mounted() {
    const route = useRoute();
    const assignmentId = route.params.id as string;
    if (assignmentId) {
      await this.quizAssignmentsStore.fetchAssignmentById(assignmentId);
      await this.problemsStore.fetchProblems();
      await this.quizAssignmentsStore.fetchAnswersByAssignment(assignmentId);

      this.loadExistingAnswers();
      this.loadCurrentAnswer();
      this.startTimer();
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    loadExistingAnswers() {
      const existingAnswers = this.quizAssignmentsStore.currentAnswers;
      existingAnswers.forEach((answer) => {
        this.answers[answer.problem.id] = answer.studentAnswer;
      });
    },

    loadCurrentAnswer() {
      if (!this.currentProblem) return;
      this.currentAnswer = this.answers[this.currentProblem.id] || '';
    },

    autoSaveAnswer() {
      if (!this.currentProblem) return;
      this.answers[this.currentProblem.id] = this.currentAnswer;

      this.quizAssignmentsStore.saveAnswer(this.assignment!.id, {
        problemId: this.currentProblem.id,
        studentAnswer: this.currentAnswer,
      });
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.problems.length - 1) {
        this.currentQuestionIndex++;
        this.loadCurrentAnswer();
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.loadCurrentAnswer();
      }
    },

    goToQuestion(index: number) {
      this.currentQuestionIndex = index;
      this.loadCurrentAnswer();
    },

    getQuestionButtonClass(index: number): string {
      const answered = this.answers[this.problems[index].id]?.trim() !== '';
      const current = index === this.currentQuestionIndex;

      if (current) return 'bg-primary-500 text-white';
      if (answered) return 'bg-success-100 text-success-700';
      return 'bg-white text-gray-700 hover:bg-gray-100';
    },

    confirmSubmit() {
      this.showSubmitConfirm = true;
    },

    cancelSubmit() {
      this.showSubmitConfirm = false;
    },

    async handleSubmit() {
      this.isSubmitting = true;
      try {
        const answersArray = this.problems.map((problem) => ({
          problemId: problem.id,
          studentAnswer: this.answers[problem.id] || '',
        }));

        await this.quizAssignmentsStore.submitQuiz(this.assignment!.id, answersArray);

        const router = useRouter();
        router.push('/student/quizzes');
      } catch (error) {
        console.error('Failed to submit quiz:', error);
      } finally {
        this.isSubmitting = false;
      }
    },

    startTimer() {
      if (!this.assignment?.quizTemplate.durationMinutes) {
        this.timeRemaining = 'No time limit';
        return;
      }

      const startTime = new Date(this.assignment.startedAt || new Date()).getTime();
      const duration = this.assignment.quizTemplate.durationMinutes * 60 * 1000;

      this.timer = window.setInterval(() => {
        const now = new Date().getTime();
        const elapsed = now - startTime;
        const remaining = Math.max(0, duration - elapsed);

        if (remaining === 0) {
          this.handleSubmit();
          if (this.timer) clearInterval(this.timer);
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);
    },
  },
});
</script>
