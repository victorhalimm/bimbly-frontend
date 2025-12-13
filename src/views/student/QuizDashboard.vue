<template>
  <div class="min-h-screen bg-white">
    <div class="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 py-20 pt-36 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-20 right-20 w-48 h-48 bg-blue-200 rounded-full opacity-40 blur-3xl animate-blob"></div>
      <div class="absolute bottom-32 left-10 w-64 h-64 bg-yellow-200 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>

      <div class="absolute top-1/4 left-16 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
      <div class="absolute bottom-1/3 right-24 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute top-1/2 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1500"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-5xl text-center md:text-6xl font-black text-gray-900 mb-4">
          My
          <span class="relative inline-block px-1">
            <span class="relative z-20 text-blue-600 font-cursive italic">Quizzes</span>
            <svg class="absolute -bottom-2 left-0 w-full h-4 z-10" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
            </svg>
          </span>
        </h1>
        <p class="text-xl text-center text-gray-600 font-medium max-w-xl mx-auto">
          Complete assigned quizzes and track your progress
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-16">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" fill="white" class="w-full h-full">
          <path d="M0,0 C150,50 350,50 600,25 C850,0 1050,0 1200,25 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-wrap gap-2 justify-center mb-8">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-5 py-2.5 rounded-full font-semibold text-sm transition-all',
            activeFilter === filter.value
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow border border-gray-200'
          ]"
        >
          {{ filter.label }}
          <span v-if="getCountByStatus(filter.value) > 0" class="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
            {{ getCountByStatus(filter.value) }}
          </span>
        </button>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="i in 10" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
          <div class="h-28 bg-gray-200"></div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-3/4 mb-3"></div>
            <div class="flex gap-1">
              <div class="h-5 bg-gray-100 rounded-full w-16"></div>
              <div class="h-5 bg-gray-100 rounded-full w-12"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="filteredAssignments.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconClipboardList size="48" stroke="1.5" class="text-gray-400" />
        </div>
        <p class="text-xl font-bold text-gray-700 mb-2">
          {{ activeFilter === 'all' ? 'No quizzes assigned yet' : 'No quizzes with this status' }}
        </p>
        <p class="text-gray-500">Check back later for new assignments!</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <QuizCard
          v-for="assignment in filteredAssignments"
          :key="assignment.id"
          :title="assignment.quizTemplate?.title || 'Quiz'"
          :description="assignment.quizTemplate?.description"
          :subject="assignment.quizTemplate?.subject || 'General'"
          :question-count="assignment.quizTemplate?.questions?.length"
          :total-points="assignment.quizTemplate?.totalPoints"
          :status="assignment.status"
          :date="formatDate(assignment.assignedAt)"
          :score="assignment.score"
          :badge="getDeadlineBadge(assignment)"
          :badge-variant="isOverdue(assignment) ? 'danger' : 'warning'"
          :show-status="true"
          :show-actions="true"
          @click="handleCardClick(assignment)"
        >
          <template #actions>
            <button
              v-if="assignment.status === 'assigned' || assignment.status === 'in_progress'"
              @click.stop="takeQuiz(assignment.id)"
              class="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors"
            >
              {{ assignment.status === 'assigned' ? 'Start' : 'Continue' }}
            </button>
            <button
              v-else-if="assignment.status === 'graded'"
              @click.stop="viewResults(assignment.id)"
              class="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
            >
              Results
            </button>
            <button
              v-else
              disabled
              class="flex-1 py-2 bg-gray-200 text-gray-500 text-xs font-bold rounded-full cursor-not-allowed"
            >
              Pending
            </button>
          </template>
        </QuizCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import QuizCard from '../../components/quiz/QuizCard.vue';
import { IconClipboardList } from '@tabler/icons-vue';
import type { QuizAssignment } from '../../services/quiz-assignments.service';

interface StatusFilter {
  value: string;
  label: string;
}

interface ComponentData {
  activeFilter: string;
}

export default defineComponent({
  name: 'QuizDashboard',
  components: {
    QuizCard,
    IconClipboardList,
  },
  data(): ComponentData {
    return {
      activeFilter: 'all',
    };
  },
  computed: {
    store() {
      return useQuizStore();
    },
    assignments(): QuizAssignment[] {
      return this.store.assignments;
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
    statusFilters(): StatusFilter[] {
      return [
        { value: 'all', label: 'All' },
        { value: 'assigned', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'graded', label: 'Graded' },
      ];
    },
    filteredAssignments(): QuizAssignment[] {
      if (this.activeFilter === 'all') {
        return this.assignments;
      }
      return this.assignments.filter(a => a.status === this.activeFilter);
    },
  },
  async mounted() {
    await this.store.fetchStudentAssignments();
  },
  methods: {
    getCountByStatus(status: string): number {
      if (status === 'all') {
        return this.assignments.length;
      }
      return this.assignments.filter(a => a.status === status).length;
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    },
    getDeadlineBadge(assignment: QuizAssignment): string {
      if (!assignment.deadline) return '';
      if (assignment.status === 'graded' || assignment.status === 'submitted') return '';
      const deadline = new Date(assignment.deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Overdue';
      if (diffDays === 0) return 'Due Today';
      if (diffDays === 1) return 'Due Tomorrow';
      if (diffDays <= 3) return `${diffDays} days left`;
      return '';
    },
    isOverdue(assignment: QuizAssignment): boolean {
      if (!assignment.deadline) return false;
      if (assignment.status === 'graded' || assignment.status === 'submitted') return false;
      return new Date(assignment.deadline) < new Date();
    },
    handleCardClick(assignment: QuizAssignment): void {
      if (assignment.status === 'graded') {
        this.viewResults(assignment.id);
      } else if (assignment.status === 'assigned' || assignment.status === 'in_progress') {
        this.takeQuiz(assignment.id);
      }
    },
    takeQuiz(assignmentId: string): void {
      this.$router.push(`/student/quiz/${assignmentId}`);
    },
    viewResults(assignmentId: string): void {
      this.$router.push(`/student/quiz/${assignmentId}/results`);
    },
  },
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.03);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.97);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.01);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
