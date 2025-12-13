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
          Quiz
          <span class="relative inline-block px-1">
            <span class="relative z-20 text-blue-600 font-cursive italic">Assignments</span>
            <svg class="absolute -bottom-2 left-0 w-full h-4 z-10" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
            </svg>
          </span>
        </h1>
        <p class="text-xl text-center text-gray-600 font-medium max-w-xl mx-auto">
          Track and grade your students' quiz submissions
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
          <IconClipboardCheck size="48" stroke="1.5" class="text-gray-400" />
        </div>
        <p class="text-xl font-bold text-gray-700 mb-2">
          {{ activeFilter === 'all' ? 'No assignments yet' : 'No assignments with this status' }}
        </p>
        <p class="text-gray-500">
          {{ activeFilter === 'all' ? 'Assign quizzes to students to see them here' : 'Try a different filter' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="assignment in filteredAssignments"
          :key="assignment.id"
          class="quiz-card group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          @click="handleCardClick(assignment)"
        >
          <div
            class="h-28 relative overflow-hidden"
            :class="getSubjectGradient(assignment.quizTemplate?.subject)"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <component
                :is="getSubjectIcon(assignment.quizTemplate?.subject)"
                :size="48"
                :stroke="1.5"
                class="text-white/90"
              />
            </div>
            <div class="absolute top-2 right-2 w-16 h-16 rounded-full opacity-20 bg-white/30"></div>
            <div class="absolute bottom-0 left-4 w-8 h-8 rounded-full opacity-15 bg-white/40"></div>

            <div v-if="assignment.status === 'submitted'" class="absolute top-2 left-2">
              <span class="px-2 py-1 text-xs font-bold rounded-full bg-orange-500 text-white">
                Needs Grading
              </span>
            </div>
          </div>

          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {{ assignment.quizTemplate?.title || 'Quiz' }}
            </h3>

            <div class="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <IconUser size="14" stroke="2" />
              <span class="truncate">{{ assignment.student?.user?.fullName || 'Student' }}</span>
            </div>

            <div class="flex flex-wrap gap-1 mb-3">
              <span
                class="px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="getSubjectBadgeClass(assignment.quizTemplate?.subject)"
              >
                {{ assignment.quizTemplate?.subject || 'N/A' }}
              </span>
              <span
                class="px-2 py-0.5 text-xs font-bold rounded-full"
                :class="getStatusClass(assignment.status)"
              >
                {{ getStatusLabel(assignment.status) }}
              </span>
            </div>

            <div v-if="assignment.score !== null && assignment.score !== undefined" class="flex items-center gap-1 text-xs text-green-600 font-semibold mb-3">
              <IconCheck size="14" stroke="2" />
              <span>{{ assignment.score }}/{{ assignment.quizTemplate?.totalPoints || 0 }}</span>
            </div>

            <div class="flex items-center text-xs text-gray-400 mb-3">
              <IconCalendar size="14" stroke="2" class="mr-1" />
              <span>{{ formatDate(assignment.assignedAt) }}</span>
            </div>

            <div class="flex gap-2">
              <button
                v-if="assignment.status === 'submitted'"
                @click.stop="gradeQuiz(assignment.id)"
                class="flex-1 py-2 bg-yellow-500 text-white text-xs font-bold rounded-full hover:bg-yellow-600 transition-colors"
              >
                Grade
              </button>
              <button
                v-else
                @click.stop="viewDetails(assignment.id)"
                class="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import {
  IconClipboardCheck,
  IconUser,
  IconCalendar,
  IconCheck,
  IconMath,
  IconAtom,
  IconFlask2,
  IconPlant,
  IconLanguage,
  IconLetterA,
  IconWorld,
  IconCoin,
  IconArticle,
  IconDeviceDesktop,
  IconFriends,
  IconBook,
} from '@tabler/icons-vue';
import type { QuizAssignment } from '../../services/quiz-assignments.service';

interface StatusFilter {
  value: string;
  label: string;
}

interface ComponentData {
  activeFilter: string;
}

const SUBJECT_CONFIG: Record<string, { icon: string; gradient: string; badgeClass: string }> = {
  Matematika: {
    icon: 'IconMath',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  Fisika: {
    icon: 'IconAtom',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  Kimia: {
    icon: 'IconFlask2',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  Biologi: {
    icon: 'IconPlant',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    badgeClass: 'bg-green-100 text-green-700',
  },
  'Bahasa Indonesia': {
    icon: 'IconLanguage',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700',
  },
  'Bahasa Inggris': {
    icon: 'IconLetterA',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  IPA: {
    icon: 'IconAtom',
    gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    badgeClass: 'bg-cyan-100 text-cyan-700',
  },
  IPS: {
    icon: 'IconWorld',
    gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  Ekonomi: {
    icon: 'IconCoin',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  Geografi: {
    icon: 'IconWorld',
    gradient: 'bg-gradient-to-br from-teal-500 to-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
  Sejarah: {
    icon: 'IconArticle',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  PKN: {
    icon: 'IconFriends',
    gradient: 'bg-gradient-to-br from-rose-500 to-rose-600',
    badgeClass: 'bg-rose-100 text-rose-700',
  },
  Informatika: {
    icon: 'IconDeviceDesktop',
    gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  default: {
    icon: 'IconBook',
    gradient: 'bg-gradient-to-br from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700',
  },
};

export default defineComponent({
  name: 'TutorAssignments',
  components: {
    IconClipboardCheck,
    IconUser,
    IconCalendar,
    IconCheck,
    IconMath,
    IconAtom,
    IconFlask2,
    IconPlant,
    IconLanguage,
    IconLetterA,
    IconWorld,
    IconCoin,
    IconArticle,
    IconDeviceDesktop,
    IconFriends,
    IconBook,
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
        { value: 'assigned', label: 'Assigned' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'submitted', label: 'Needs Grading' },
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
    await this.store.fetchTutorAssignments();
  },
  methods: {
    getCountByStatus(status: string): number {
      if (status === 'all') {
        return this.assignments.length;
      }
      return this.assignments.filter(a => a.status === status).length;
    },
    getStatusLabel(status: string): string {
      const labels: Record<string, string> = {
        assigned: 'Not Started',
        in_progress: 'In Progress',
        submitted: 'Submitted',
        graded: 'Graded',
      };
      return labels[status] || status;
    },
    getStatusClass(status: string): string {
      const classes: Record<string, string> = {
        assigned: 'bg-gray-200 text-gray-700',
        in_progress: 'bg-yellow-100 text-yellow-700',
        submitted: 'bg-orange-100 text-orange-700',
        graded: 'bg-green-100 text-green-700',
      };
      return classes[status] || 'bg-gray-200 text-gray-700';
    },
    getSubjectIcon(subject: string | undefined): string {
      const config = SUBJECT_CONFIG[subject || ''] || SUBJECT_CONFIG.default;
      return config.icon;
    },
    getSubjectGradient(subject: string | undefined): string {
      const config = SUBJECT_CONFIG[subject || ''] || SUBJECT_CONFIG.default;
      return config.gradient;
    },
    getSubjectBadgeClass(subject: string | undefined): string {
      const config = SUBJECT_CONFIG[subject || ''] || SUBJECT_CONFIG.default;
      return config.badgeClass;
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    },
    handleCardClick(assignment: QuizAssignment): void {
      if (assignment.status === 'submitted') {
        this.gradeQuiz(assignment.id);
      } else {
        this.viewDetails(assignment.id);
      }
    },
    gradeQuiz(assignmentId: string): void {
      this.$router.push(`/tutor/assignments/${assignmentId}/grade`);
    },
    viewDetails(assignmentId: string): void {
      this.$router.push(`/tutor/assignments/${assignmentId}`);
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
