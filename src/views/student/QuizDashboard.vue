<template>
  <div class="quiz-dashboard-page p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">My Quizzes</h1>
      <p class="text-gray-600 mt-2">View and complete your assigned quizzes</p>
    </div>

    <div class="mb-6 flex space-x-4">
      <NeoButton
        :variant="filter === 'all' ? 'primary' : 'secondary'"
        @click="filter = 'all'"
      >
        All
      </NeoButton>
      <NeoButton
        :variant="filter === 'pending' ? 'primary' : 'secondary'"
        @click="filter = 'pending'"
      >
        Pending ({{ pendingCount }})
      </NeoButton>
      <NeoButton
        :variant="filter === 'graded' ? 'primary' : 'secondary'"
        @click="filter = 'graded'"
      >
        Graded
      </NeoButton>
    </div>

    <div v-if="quizAssignmentsStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading quizzes...</p>
    </div>

    <div v-else-if="quizAssignmentsStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ quizAssignmentsStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="filteredAssignments.length === 0" class="text-center py-12">
      <NeoCard>
        <div class="py-8">
          <p class="text-gray-500 font-bold text-lg mb-4">
            No quizzes {{ filter !== 'all' ? `(${filter})` : '' }}
          </p>
        </div>
      </NeoCard>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NeoCard
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        class="quiz-card"
      >
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-xl font-black text-gray-900 mb-1">
                {{ assignment.quizTemplate.title }}
              </h3>
              <p class="text-sm text-gray-600">
                Assigned by {{ assignment.tutor?.user?.fullName || 'Tutor' }}
              </p>
            </div>
            <span
              class="px-3 py-1 border-2 border-black rounded-lg font-bold text-xs uppercase"
              :class="statusColorClass(assignment.status)"
            >
              {{ statusLabel(assignment.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-bold text-gray-600 uppercase">Questions</p>
              <p class="text-2xl font-black text-gray-900">
                {{ assignment.quizTemplate.problemIds?.length || 0 }}
              </p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-600 uppercase">Total Points</p>
              <p class="text-2xl font-black text-primary-600">
                {{ assignment.quizTemplate.totalPoints }}
              </p>
            </div>
          </div>

          <div v-if="assignment.quizTemplate.durationMinutes" class="text-sm text-gray-600">
            Time Limit: {{ assignment.quizTemplate.durationMinutes }} minutes
          </div>

          <div v-if="assignment.deadline" class="text-sm">
            <span class="font-bold text-gray-700">Deadline:</span>
            <span :class="isOverdue(assignment.deadline) ? 'text-error-600 font-bold' : 'text-gray-600'">
              {{ formatDeadline(assignment.deadline) }}
            </span>
          </div>

          <div v-if="assignment.status === 'graded' && assignment.score !== null" class="text-center py-3 bg-primary-50 border-2 border-black rounded-xl">
            <p class="text-xs font-bold text-gray-600 uppercase">Your Score</p>
            <p class="text-3xl font-black" :class="scoreColorClass(assignment.score)">
              {{ assignment.score.toFixed(2) }}%
            </p>
          </div>

          <div class="pt-4 border-t-2 border-gray-200">
            <NeoButton
              v-if="assignment.status === 'assigned'"
              variant="primary"
              size="sm"
              @click="startQuiz(assignment.id)"
              class="w-full"
            >
              Start Quiz
            </NeoButton>
            <NeoButton
              v-else-if="assignment.status === 'in_progress'"
              variant="warning"
              size="sm"
              @click="continueQuiz(assignment.id)"
              class="w-full"
            >
              Continue Quiz
            </NeoButton>
            <NeoButton
              v-else-if="assignment.status === 'submitted'"
              variant="secondary"
              size="sm"
              disabled
              class="w-full"
            >
              Waiting for Grading
            </NeoButton>
            <NeoButton
              v-else-if="assignment.status === 'graded'"
              variant="success"
              size="sm"
              @click="viewResults(assignment.id)"
              class="w-full"
            >
              View Results
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoButton, NeoCard, NeoAlert } from '@/components/common/ui';
import { useQuizAssignmentsStore } from '@/stores/quizAssignments.store';
import { useRouter } from 'vue-router';

type QuizStatus = 'assigned' | 'in_progress' | 'submitted' | 'graded';

interface QuizAssignment {
  id: string;
  quizTemplate: {
    id: string;
    title: string;
    problemIds?: string[];
    totalPoints: number;
    durationMinutes?: number;
  };
  tutor?: {
    user: {
      fullName: string;
    };
  };
  deadline?: string;
  status: QuizStatus;
  score?: number;
}

interface ComponentData {
  filter: 'all' | 'pending' | 'graded';
}

export default defineComponent({
  name: 'QuizDashboard',
  components: { NeoButton, NeoCard, NeoAlert },
  data(): ComponentData {
    return {
      filter: 'all',
    };
  },
  computed: {
    quizAssignmentsStore() {
      return useQuizAssignmentsStore();
    },

    filteredAssignments(): QuizAssignment[] {
      const assignments = this.quizAssignmentsStore.assignments;
      if (this.filter === 'all') return assignments;
      if (this.filter === 'pending') {
        return assignments.filter((a) => a.status === 'assigned' || a.status === 'in_progress');
      }
      return assignments.filter((a) => a.status === 'graded');
    },

    pendingCount(): number {
      return this.quizAssignmentsStore.assignments.filter(
        (a) => a.status === 'assigned' || a.status === 'in_progress'
      ).length;
    },
  },
  async mounted() {
    await this.quizAssignmentsStore.fetchAssignments();
  },
  methods: {
    statusLabel(status: QuizStatus): string {
      const labels: Record<QuizStatus, string> = {
        assigned: 'Not Started',
        in_progress: 'In Progress',
        submitted: 'Submitted',
        graded: 'Graded',
      };
      return labels[status] || status;
    },

    statusColorClass(status: QuizStatus): string {
      const colors: Record<QuizStatus, string> = {
        assigned: 'bg-gray-100 text-gray-700',
        in_progress: 'bg-warning-100 text-warning-700',
        submitted: 'bg-primary-100 text-primary-700',
        graded: 'bg-success-100 text-success-700',
      };
      return colors[status] || 'bg-gray-100 text-gray-700';
    },

    scoreColorClass(score: number): string {
      if (score >= 85) return 'text-success-600';
      if (score >= 70) return 'text-primary-600';
      if (score >= 60) return 'text-warning-600';
      return 'text-error-600';
    },

    isOverdue(deadline: string): boolean {
      return new Date(deadline) < new Date();
    },

    formatDeadline(deadline: string): string {
      const date = new Date(deadline);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    async startQuiz(assignmentId: string) {
      try {
        await this.quizAssignmentsStore.startQuiz(assignmentId);
        const router = useRouter();
        router.push(`/student/take-quiz/${assignmentId}`);
      } catch (error) {
        console.error('Failed to start quiz:', error);
      }
    },

    continueQuiz(assignmentId: string) {
      const router = useRouter();
      router.push(`/student/take-quiz/${assignmentId}`);
    },

    viewResults(assignmentId: string) {
      const router = useRouter();
      router.push(`/student/quiz-results/${assignmentId}`);
    },
  },
});
</script>

<style scoped>
.quiz-card {
  transition: transform 0.2s ease-in-out;
}

.quiz-card:hover {
  transform: translateY(-2px);
}
</style>
