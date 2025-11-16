<template>
  <div class="grade-quiz-page p-6 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">Grade Quiz</h1>
      <p class="text-gray-600 mt-2">Review and grade student submissions</p>
    </div>

    <div v-if="quizAssignmentsStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading quiz...</p>
    </div>

    <div v-else-if="quizAssignmentsStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ quizAssignmentsStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="quizResults" class="space-y-6">
      <NeoCard>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-xs font-bold text-gray-600 uppercase">Student</p>
            <p class="text-lg font-black text-gray-900">
              {{ quizResults.assignment.student?.user?.fullName || 'Unknown' }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-600 uppercase">Submitted</p>
            <p class="text-lg font-black text-gray-900">
              {{ formattedSubmittedDate }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-600 uppercase">Current Score</p>
            <p class="text-3xl font-black" :class="scoreColorClass">
              {{ currentScore }}%
            </p>
          </div>
        </div>
      </NeoCard>

      <div class="space-y-4">
        <div
          v-for="(answer, index) in quizResults.answers"
          :key="answer.id"
          class="answer-item"
        >
          <NeoCard>
            <div class="space-y-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg font-bold text-xs">
                      Question {{ index + 1 }}
                    </span>
                    <span
                      class="px-3 py-1 border-2 border-black rounded-lg font-bold text-xs"
                      :class="typeColorClass(answer.problem.questionType)"
                    >
                      {{ typeLabel(answer.problem.questionType) }}
                    </span>
                    <span class="px-3 py-1 bg-primary-100 border-2 border-black rounded-lg font-bold text-xs text-primary-700">
                      {{ answer.problem.points }} pts
                    </span>
                  </div>
                  <p class="text-gray-900 font-bold">{{ answer.questionText }}</p>
                </div>
              </div>

              <div class="border-l-4 border-primary-500 pl-4 py-2">
                <p class="text-xs font-bold text-primary-700 uppercase mb-1">Student Answer:</p>
                <p class="text-gray-700">{{ answer.studentAnswer }}</p>
              </div>

              <div v-if="answer.isCorrect !== null" class="flex items-center space-x-3">
                <span
                  class="px-4 py-2 border-2 border-black rounded-lg font-bold text-sm"
                  :class="answer.isCorrect ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'"
                >
                  {{ answer.isCorrect ? '✓ Correct' : '✗ Incorrect' }}
                </span>
                <span class="font-bold text-gray-900">
                  {{ answer.pointsEarned }} / {{ answer.problem.points }} points
                </span>
              </div>

              <div v-if="answer.problem.questionType === 'essay' && answer.isCorrect === null" class="space-y-4 pt-4 border-t-2 border-gray-200">
                <p class="font-bold text-gray-900">Grade this essay:</p>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    Points Earned (0-{{ answer.problem.points }})
                  </label>
                  <NeoInput
                    v-model.number="gradingData[answer.id].pointsEarned"
                    type="number"
                    :min="0"
                    :max="answer.problem.points"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    Feedback (Optional)
                  </label>
                  <NeoTextarea
                    v-model="gradingData[answer.id].tutorFeedback"
                    placeholder="Provide feedback to help the student improve"
                    rows="3"
                    :maxlength="1000"
                  />
                </div>
                <NeoButton
                  variant="primary"
                  size="sm"
                  @click="gradeAnswer(answer.id)"
                  :disabled="isGrading"
                >
                  {{ isGrading ? 'Grading...' : 'Submit Grade' }}
                </NeoButton>
              </div>

              <div v-else-if="answer.tutorFeedback" class="border-l-4 border-success-500 pl-4 py-2 mt-4">
                <p class="text-xs font-bold text-success-700 uppercase mb-1">Tutor Feedback:</p>
                <p class="text-gray-700">{{ answer.tutorFeedback }}</p>
              </div>
            </div>
          </NeoCard>
        </div>
      </div>

      <NeoCard class="bg-primary-50">
        <div class="text-center py-4">
          <p class="text-sm font-bold text-gray-700 uppercase mb-2">Final Score</p>
          <p class="text-5xl font-black text-primary-600">{{ currentScore }}%</p>
          <p class="text-sm text-gray-600 mt-2">
            {{ totalEarned }} / {{ totalPoints }} points
          </p>
        </div>
      </NeoCard>

      <div class="flex justify-center">
        <NeoButton variant="secondary" @click="goBack">
          Back to Assignments
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoInput, NeoTextarea, NeoAlert } from '@/components/common/ui';
import { useQuizAssignmentsStore } from '@/stores/quizAssignments.store';
import { useRouter, useRoute } from 'vue-router';

interface ComponentData {
  gradingData: Record<string, { pointsEarned: number; tutorFeedback: string }>;
  isGrading: boolean;
}

export default defineComponent({
  name: 'GradeQuiz',
  components: { NeoCard, NeoButton, NeoInput, NeoTextarea, NeoAlert },
  data(): ComponentData {
    return {
      gradingData: {},
      isGrading: false,
    };
  },
  computed: {
    quizAssignmentsStore() {
      return useQuizAssignmentsStore();
    },

    quizResults() {
      return this.quizAssignmentsStore.quizResults;
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

    totalPoints(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.reduce((sum, a) => sum + a.problem.points, 0);
    },

    totalEarned(): number {
      if (!this.quizResults) return 0;
      return this.quizResults.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    },

    currentScore(): string {
      if (!this.totalPoints) return '0';
      return ((this.totalEarned / this.totalPoints) * 100).toFixed(2);
    },

    scoreColorClass(): string {
      const score = parseFloat(this.currentScore);
      if (score >= 85) return 'text-success-600';
      if (score >= 70) return 'text-primary-600';
      if (score >= 60) return 'text-warning-600';
      return 'text-error-600';
    },
  },
  async mounted() {
    const route = useRoute();
    const assignmentId = route.params.id as string;
    if (assignmentId) {
      await this.quizAssignmentsStore.fetchQuizResults(assignmentId);
      await this.quizAssignmentsStore.fetchAnswersByAssignment(assignmentId);
      this.initializeGradingData();
    }
  },
  methods: {
    initializeGradingData() {
      if (!this.quizResults) return;
      this.quizResults.answers.forEach((answer) => {
        if (answer.problem.questionType === 'essay' && answer.isCorrect === null) {
          this.gradingData[answer.id] = {
            pointsEarned: 0,
            tutorFeedback: '',
          };
        }
      });
    },

    typeLabel(type: string): string {
      const labels: Record<string, string> = {
        multiple_choice: 'Multiple Choice',
        essay: 'Essay',
        short_answer: 'Short Answer',
      };
      return labels[type] || type;
    },

    typeColorClass(type: string): string {
      const colors: Record<string, string> = {
        multiple_choice: 'bg-primary-100 text-primary-700',
        essay: 'bg-warning-100 text-warning-700',
        short_answer: 'bg-success-100 text-success-700',
      };
      return colors[type] || 'bg-gray-100 text-gray-700';
    },

    async gradeAnswer(answerId: string) {
      const gradeData = this.gradingData[answerId];
      if (gradeData.pointsEarned === null || gradeData.pointsEarned === undefined) return;

      this.isGrading = true;
      try {
        await this.quizAssignmentsStore.gradeAnswer(answerId, {
          pointsEarned: gradeData.pointsEarned,
          tutorFeedback: gradeData.tutorFeedback || undefined,
        });

        const route = useRoute();
        const assignmentId = route.params.id as string;
        await this.quizAssignmentsStore.fetchQuizResults(assignmentId);
        await this.quizAssignmentsStore.fetchAnswersByAssignment(assignmentId);
      } catch (error) {
        console.error('Failed to grade answer:', error);
      } finally {
        this.isGrading = false;
      }
    },

    goBack() {
      const router = useRouter();
      router.back();
    },
  },
});
</script>
