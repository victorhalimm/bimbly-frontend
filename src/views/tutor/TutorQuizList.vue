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
        <p class="text-xl text-center text-gray-600 font-medium max-w-xl mx-auto mb-8">
          Create and manage quiz templates for your students
        </p>

        <div class="flex justify-center">
          <button
            @click="$router.push('/tutor/quizzes/create')"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl"
          >
            <IconPlus size="20" stroke="2" />
            Create New Quiz
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-16">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" fill="white" class="w-full h-full">
          <path d="M0,0 C150,50 350,50 600,25 C850,0 1050,0 1200,25 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
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

      <div v-else-if="templates.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconFileDescription size="48" stroke="1.5" class="text-blue-500" />
        </div>
        <p class="text-xl font-bold text-gray-700 mb-2">No quizzes created yet</p>
        <p class="text-gray-500 mb-6">Create your first quiz to get started!</p>
        <button
          @click="$router.push('/tutor/quizzes/create')"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
        >
          <IconPlus size="20" stroke="2" />
          Create Quiz
        </button>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <QuizCard
          v-for="template in templates"
          :key="template.id"
          :title="template.title"
          :description="template.description"
          :subject="template.subject"
          :question-count="template.questions?.length"
          :total-points="template.totalPoints"
          :date="formatDate(template.createdAt)"
          :show-actions="true"
          @click="viewTemplate(template.id)"
        >
          <template #actions>
            <button
              @click.stop="editTemplate(template.id)"
              class="flex-1 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              @click.stop="assignQuiz(template.id)"
              class="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
            >
              Assign
            </button>
            <button
              @click.stop="confirmDelete(template)"
              class="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              <IconTrash size="14" stroke="2" />
            </button>
          </template>
        </QuizCard>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <IconAlertTriangle size="32" stroke="2" class="text-red-600" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-2 text-center">Delete Quiz</h3>
          <p class="text-gray-600 mb-6 text-center">
            Are you sure you want to delete "<strong>{{ templateToDelete?.title }}</strong>"? This action cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteTemplate"
              :disabled="deleting"
              class="flex-1 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import QuizCard from '../../components/quiz/QuizCard.vue';
import {
  IconPlus,
  IconFileDescription,
  IconTrash,
  IconAlertTriangle,
} from '@tabler/icons-vue';
import type { QuizTemplate } from '../../services/quiz-templates.service';

interface ComponentData {
  showDeleteModal: boolean;
  templateToDelete: QuizTemplate | null;
  deleting: boolean;
}

export default defineComponent({
  name: 'TutorQuizList',
  components: {
    QuizCard,
    IconPlus,
    IconFileDescription,
    IconTrash,
    IconAlertTriangle,
  },
  data(): ComponentData {
    return {
      showDeleteModal: false,
      templateToDelete: null,
      deleting: false,
    };
  },
  computed: {
    store() {
      return useQuizStore();
    },
    templates(): QuizTemplate[] {
      return this.store.templates;
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
  },
  async mounted() {
    await this.store.fetchTemplates();
  },
  methods: {
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    },
    viewTemplate(id: string): void {
      this.$router.push(`/tutor/quizzes/${id}`);
    },
    editTemplate(id: string): void {
      this.$router.push(`/tutor/quizzes/${id}/edit`);
    },
    assignQuiz(id: string): void {
      this.$router.push(`/tutor/quizzes/${id}/assign`);
    },
    confirmDelete(template: QuizTemplate): void {
      this.templateToDelete = template;
      this.showDeleteModal = true;
    },
    async deleteTemplate(): Promise<void> {
      if (!this.templateToDelete) return;

      this.deleting = true;
      try {
        await this.store.deleteTemplate(this.templateToDelete.id);
        this.showDeleteModal = false;
        this.templateToDelete = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete quiz';
        alert(message);
      } finally {
        this.deleting = false;
      }
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
