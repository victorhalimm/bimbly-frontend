<template>
  <div class="quiz-templates-list-page p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-black text-gray-900">Quiz Templates</h1>
        <p class="text-gray-600 mt-2">Manage your reusable quiz templates</p>
      </div>
      <NeoButton
        variant="primary"
        @click="goToCreateTemplate"
      >
        + Create Template
      </NeoButton>
    </div>

    <div class="mb-6 flex space-x-4">
      <NeoButton
        :variant="showPublic ? 'secondary' : 'primary'"
        @click="showPublic = false"
      >
        My Templates
      </NeoButton>
      <NeoButton
        :variant="showPublic ? 'primary' : 'secondary'"
        @click="showPublic = true"
      >
        Public Templates
      </NeoButton>
    </div>

    <div v-if="quizTemplatesStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading templates...</p>
    </div>

    <div v-else-if="quizTemplatesStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ quizTemplatesStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="displayedTemplates.length === 0" class="text-center py-12">
      <NeoCard>
        <div class="py-8">
          <p class="text-gray-500 font-bold text-lg mb-4">
            {{ showPublic ? 'No public templates available' : 'No templates yet' }}
          </p>
          <NeoButton v-if="!showPublic" variant="primary" @click="goToCreateTemplate">
            Create Your First Template
          </NeoButton>
        </div>
      </NeoCard>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NeoCard
        v-for="template in displayedTemplates"
        :key="template.id"
        class="template-card cursor-pointer hover:shadow-2xl transition-all"
        @click="viewTemplate(template)"
      >
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-xl font-black text-gray-900 mb-1">
                {{ template.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ template.subject }}</p>
            </div>
            <span
              v-if="template.isPublic"
              class="px-2 py-1 bg-success-100 border-2 border-black rounded-lg text-xs font-bold text-success-700"
            >
              PUBLIC
            </span>
          </div>

          <p v-if="template.description" class="text-sm text-gray-700 line-clamp-2">
            {{ template.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="grade in template.gradeLevels"
              :key="grade"
              class="px-2 py-1 bg-primary-100 border-2 border-black rounded-lg text-xs font-bold text-primary-700"
            >
              Grade {{ grade }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-200">
            <div>
              <p class="text-xs font-bold text-gray-600 uppercase">Questions</p>
              <p class="text-2xl font-black text-gray-900">{{ template.problemIds.length }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-600 uppercase">Total Points</p>
              <p class="text-2xl font-black text-primary-600">{{ template.totalPoints }}</p>
            </div>
          </div>

          <div v-if="template.durationMinutes" class="text-sm text-gray-600">
            Time Limit: {{ template.durationMinutes }} minutes
          </div>

          <div class="text-xs text-gray-500">
            Used {{ template.timesUsed }} {{ template.timesUsed === 1 ? 'time' : 'times' }}
          </div>

          <div class="flex space-x-2 pt-4 border-t-2 border-gray-200">
            <NeoButton
              variant="primary"
              size="sm"
              @click.stop="goToAssignQuiz(template.id)"
            >
              Assign
            </NeoButton>
            <NeoButton
              v-if="!showPublic"
              variant="secondary"
              size="sm"
              @click.stop="handleEdit(template.id)"
            >
              Edit
            </NeoButton>
            <NeoButton
              v-if="!showPublic"
              variant="error"
              size="sm"
              @click.stop="confirmDelete(template.id)"
            >
              Delete
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelDelete"
    >
      <NeoCard class="max-w-md w-full mx-4">
        <h3 class="text-2xl font-black text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete this quiz template? This action cannot be undone.
        </p>
        <div class="flex space-x-4">
          <NeoButton
            variant="error"
            @click="handleDelete"
            :disabled="quizTemplatesStore.isLoading"
          >
            {{ quizTemplatesStore.isLoading ? 'Deleting...' : 'Delete' }}
          </NeoButton>
          <NeoButton
            variant="secondary"
            @click="cancelDelete"
            :disabled="quizTemplatesStore.isLoading"
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
import { NeoButton, NeoCard, NeoAlert } from '@/components/common/ui';
import { useQuizTemplatesStore } from '@/stores/quizTemplates.store';
import { useRouter } from 'vue-router';

interface QuizTemplate {
  id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevels: number[];
  problemIds: string[];
  totalPoints: number;
  durationMinutes?: number;
  isPublic: boolean;
  timesUsed: number;
}

interface ComponentData {
  showPublic: boolean;
  showDeleteConfirm: boolean;
  deletingTemplateId: string | null;
}

export default defineComponent({
  name: 'QuizTemplatesList',
  components: { NeoButton, NeoCard, NeoAlert },
  data(): ComponentData {
    return {
      showPublic: false,
      showDeleteConfirm: false,
      deletingTemplateId: null,
    };
  },
  computed: {
    quizTemplatesStore() {
      return useQuizTemplatesStore();
    },

    displayedTemplates(): QuizTemplate[] {
      return this.showPublic
        ? this.quizTemplatesStore.publicTemplates
        : this.quizTemplatesStore.myTemplates;
    },
  },
  async mounted() {
    await this.quizTemplatesStore.fetchTemplates();
  },
  methods: {
    goToCreateTemplate() {
      const router = useRouter();
      router.push('/tutor/quiz-templates/create');
    },

    viewTemplate(template: QuizTemplate) {
      console.log('View template:', template);
    },

    handleEdit(templateId: string) {
      const router = useRouter();
      router.push(`/tutor/quiz-templates/edit/${templateId}`);
    },

    goToAssignQuiz(templateId: string) {
      const router = useRouter();
      router.push(`/tutor/assign-quiz?templateId=${templateId}`);
    },

    confirmDelete(templateId: string) {
      this.deletingTemplateId = templateId;
      this.showDeleteConfirm = true;
    },

    cancelDelete() {
      this.deletingTemplateId = null;
      this.showDeleteConfirm = false;
    },

    async handleDelete() {
      if (!this.deletingTemplateId) return;

      try {
        await this.quizTemplatesStore.deleteTemplate(this.deletingTemplateId);
        this.cancelDelete();
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    },
  },
});
</script>

<style scoped>
.template-card {
  transition: transform 0.2s ease-in-out;
}

.template-card:hover {
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
