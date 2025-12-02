<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          My <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Quizzes</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Create and manage quiz templates for your students</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div class="flex justify-end mb-8">
        <button
          @click="$router.push('/tutor/quizzes/create')"
          class="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Quiz
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading quizzes...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="templates.length === 0" class="text-center py-12">
        <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-600 mb-2">No quizzes created yet</p>
        <p class="text-gray-500 mb-6">Create your first quiz to get started!</p>
        <button
          @click="$router.push('/tutor/quizzes/create')"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Quiz
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="template in templates"
          :key="template.id"
          class="bg-white rounded-[2.5rem] p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          @click="viewTemplate(template.id)"
        >
          <div class="mb-4">
            <h3 class="text-2xl font-black text-gray-900 mb-2 line-clamp-2">{{ template.title }}</h3>
            <p v-if="template.description" class="text-gray-600 line-clamp-2">{{ template.description }}</p>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-sm">
              {{ template.subject }}
            </span>
            <span class="px-4 py-2 bg-gray-200 text-gray-900 rounded-full font-bold text-sm">
              {{ template.questions.length }} Questions
            </span>
            <span class="px-4 py-2 bg-green-100 text-green-900 rounded-full font-bold text-sm">
              {{ template.totalPoints }} Points
            </span>
          </div>

          <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Created {{ formatDate(template.createdAt) }}</span>
          </div>

          <div class="flex gap-2">
            <button
              @click.stop="editTemplate(template.id)"
              class="flex-1 py-3 bg-blue-100 text-blue-900 rounded-full font-bold hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              @click.stop="assignQuiz(template.id)"
              class="flex-1 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors"
            >
              Assign
            </button>
            <button
              @click.stop="confirmDelete(template)"
              class="py-3 px-4 bg-red-100 text-red-900 rounded-full font-bold hover:bg-red-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
          <h3 class="text-2xl font-black text-gray-900 mb-4">Delete Quiz</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "<strong>{{ templateToDelete?.title }}</strong>"? This action cannot be undone.
          </p>
          <div class="flex gap-4">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-3 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
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
import type { QuizTemplate } from '../../services/quiz-templates.service';

interface ComponentData {
  showDeleteModal: boolean;
  templateToDelete: QuizTemplate | null;
  deleting: boolean;
}

export default defineComponent({
  name: 'TutorQuizList',
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
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    viewTemplate(id: string) {
      this.$router.push(`/tutor/quizzes/${id}`);
    },
    editTemplate(id: string) {
      this.$router.push(`/tutor/quizzes/${id}/edit`);
    },
    assignQuiz(id: string) {
      this.$router.push(`/tutor/quizzes/${id}/assign`);
    },
    confirmDelete(template: QuizTemplate) {
      this.templateToDelete = template;
      this.showDeleteModal = true;
    },
    async deleteTemplate() {
      if (!this.templateToDelete) return;

      this.deleting = true;
      try {
        await this.store.deleteTemplate(this.templateToDelete.id);
        this.showDeleteModal = false;
        this.templateToDelete = null;
      } catch (error: any) {
        alert(error.message || 'Failed to delete quiz');
      } finally {
        this.deleting = false;
      }
    },
  },
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
