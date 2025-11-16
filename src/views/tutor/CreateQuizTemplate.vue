<template>
  <div class="create-quiz-template-page p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">
        {{ isEdit ? 'Edit Quiz Template' : 'Create Quiz Template' }}
      </h1>
      <p class="text-gray-600 mt-2">Build a reusable quiz from your question bank</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <NeoCard class="mb-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Quiz Title *
              </label>
              <NeoInput
                v-model="formData.title"
                placeholder="e.g., Algebra Fundamentals Quiz"
                required
                :maxlength="255"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <NeoTextarea
                v-model="formData.description"
                placeholder="Describe what this quiz covers"
                rows="3"
                :maxlength="2000"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Subject *
                </label>
                <NeoInput
                  v-model="formData.subject"
                  placeholder="e.g., Matematika"
                  required
                  :maxlength="100"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <NeoInput
                  v-model.number="formData.durationMinutes"
                  type="number"
                  min="1"
                  placeholder="Optional time limit"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Grade Levels *
              </label>
              <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
                <label
                  v-for="grade in 12"
                  :key="grade"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    v-model="formData.gradeLevels"
                    type="checkbox"
                    :value="grade"
                    class="w-5 h-5 border-2 border-black rounded"
                  />
                  <span class="text-sm font-bold">{{ grade }}</span>
                </label>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="formData.isPublic"
                type="checkbox"
                id="isPublic"
                class="w-5 h-5 border-2 border-black rounded"
              />
              <label for="isPublic" class="text-sm font-bold text-gray-700 cursor-pointer">
                Make this quiz public (other tutors can use it)
              </label>
            </div>

            <div v-if="error" class="mt-4">
              <NeoAlert variant="error">
                {{ error }}
              </NeoAlert>
            </div>

            <div v-if="success" class="mt-4">
              <NeoAlert variant="success">
                Quiz template {{ isEdit ? 'updated' : 'created' }} successfully!
              </NeoAlert>
            </div>

            <div class="flex space-x-4 pt-4">
              <NeoButton
                type="submit"
                variant="primary"
                :disabled="isLoading || !canSubmit || success"
              >
                {{ isLoading ? 'Saving...' : (isEdit ? 'Update Template' : 'Create Template') }}
              </NeoButton>
              <NeoButton
                type="button"
                variant="secondary"
                @click="handleCancel"
                :disabled="isLoading"
              >
                Cancel
              </NeoButton>
            </div>
          </form>
        </NeoCard>

        <NeoCard>
          <h3 class="text-xl font-black text-gray-900 mb-4">
            Available Problems
          </h3>
          <div class="mb-4">
            <NeoSelect
              v-model="filterType"
              :options="filterOptions"
              placeholder="Filter by type"
            />
          </div>
          <div v-if="problemsStore.isLoading" class="text-center py-8">
            <p class="text-gray-500 font-bold">Loading problems...</p>
          </div>
          <div v-else-if="availableProblems.length === 0" class="text-center py-8">
            <p class="text-gray-500">No problems available</p>
          </div>
          <div v-else class="space-y-4 max-h-96 overflow-y-auto">
            <ProblemCard
              v-for="problem in availableProblems"
              :key="problem.id"
              :problem="problem"
              :show-answer="false"
              :show-actions="true"
              :selected="isProblemSelected(problem.id)"
              @select="selectProblem"
              @deselect="deselectProblem"
            />
          </div>
        </NeoCard>
      </div>

      <div class="lg:col-span-1">
        <NeoCard class="sticky top-6">
          <h3 class="text-xl font-black text-gray-900 mb-4">
            Selected Problems ({{ selectedProblems.length }})
          </h3>
          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-sm">
              <span class="font-bold text-gray-700">Total Points:</span>
              <span class="font-black text-primary-600">{{ totalPoints }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="font-bold text-gray-700">Questions:</span>
              <span class="font-black">{{ selectedProblems.length }}</span>
            </div>
          </div>
          <div v-if="selectedProblems.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-sm">No problems selected yet</p>
          </div>
          <div v-else class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="(problem, index) in selectedProblems"
              :key="problem.id"
              class="p-3 bg-gray-50 border-2 border-black rounded-xl"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-xs font-bold text-gray-600 mb-1">
                    Q{{ index + 1 }} • {{ problem.points }} pts
                  </p>
                  <p class="text-sm font-bold text-gray-900 line-clamp-2">
                    {{ problem.questionText }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="deselectProblem(problem.id)"
                  class="ml-2 text-error-600 hover:text-error-700 font-black"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoInput, NeoSelect, NeoTextarea, NeoAlert } from '@/components/common/ui';
import ProblemCard from '@/components/quiz/ProblemCard.vue';
import { useProblemsStore } from '@/stores/problems.store';
import { useQuizTemplatesStore } from '@/stores/quizTemplates.store';
import { useRouter, useRoute } from 'vue-router';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface Problem {
  id: string;
  questionText: string;
  answerText: string;
  questionType: QuestionType;
  choices?: string[];
  points: number;
}

interface FormData {
  title: string;
  description: string;
  subject: string;
  gradeLevels: number[];
  durationMinutes: number | null;
  isPublic: boolean;
}

interface ComponentData {
  formData: FormData;
  selectedProblems: Problem[];
  filterType: QuestionType | '';
  isLoading: boolean;
  error: string | null;
  success: boolean;
  isEdit: boolean;
  editingId: string | null;
}

export default defineComponent({
  name: 'CreateQuizTemplate',
  components: { NeoCard, NeoButton, NeoInput, NeoSelect, NeoTextarea, NeoAlert, ProblemCard },
  data(): ComponentData {
    return {
      formData: {
        title: '',
        description: '',
        subject: '',
        gradeLevels: [],
        durationMinutes: null,
        isPublic: false,
      },
      selectedProblems: [],
      filterType: '',
      isLoading: false,
      error: null,
      success: false,
      isEdit: false,
      editingId: null,
    };
  },
  computed: {
    problemsStore() {
      return useProblemsStore();
    },

    quizTemplatesStore() {
      return useQuizTemplatesStore();
    },

    availableProblems(): Problem[] {
      if (!this.filterType) {
        return this.problemsStore.problems;
      }
      return this.problemsStore.getProblemsByType(this.filterType);
    },

    filterOptions() {
      return [
        { label: 'All Types', value: '' },
        { label: 'Multiple Choice', value: 'multiple_choice' },
        { label: 'Essay', value: 'essay' },
        { label: 'Short Answer', value: 'short_answer' },
      ];
    },

    totalPoints(): number {
      return this.selectedProblems.reduce((sum, p) => sum + p.points, 0);
    },

    canSubmit(): boolean {
      return (
        this.formData.title.trim() !== '' &&
        this.formData.subject.trim() !== '' &&
        this.formData.gradeLevels.length > 0 &&
        this.selectedProblems.length > 0
      );
    },
  },
  async mounted() {
    await this.problemsStore.fetchProblems();

    const route = useRoute();
    const templateId = route.params.id as string;
    if (templateId) {
      this.isEdit = true;
      this.editingId = templateId;
      await this.loadTemplate(templateId);
    }
  },
  methods: {
    async loadTemplate(id: string) {
      this.isLoading = true;
      try {
        const template = await this.quizTemplatesStore.fetchTemplateById(id);
        this.formData = {
          title: template.title,
          description: template.description || '',
          subject: template.subject,
          gradeLevels: template.gradeLevels,
          durationMinutes: template.durationMinutes || null,
          isPublic: template.isPublic,
        };

        this.selectedProblems = this.problemsStore.problems.filter((p) =>
          template.problemIds.includes(p.id)
        );
      } catch (err: any) {
        this.error = err.message || 'Failed to load template';
      } finally {
        this.isLoading = false;
      }
    },

    isProblemSelected(problemId: string): boolean {
      return this.selectedProblems.some((p) => p.id === problemId);
    },

    selectProblem(problem: Problem) {
      if (!this.isProblemSelected(problem.id)) {
        this.selectedProblems.push(problem);
      }
    },

    deselectProblem(problemId: string) {
      this.selectedProblems = this.selectedProblems.filter((p) => p.id !== problemId);
    },

    async handleSubmit() {
      if (!this.canSubmit) return;

      this.isLoading = true;
      this.error = null;
      this.success = false;

      try {
        const data: any = {
          title: this.formData.title,
          subject: this.formData.subject,
          gradeLevels: this.formData.gradeLevels,
          problemIds: this.selectedProblems.map((p) => p.id),
          isPublic: this.formData.isPublic,
        };

        if (this.formData.description) data.description = this.formData.description;
        if (this.formData.durationMinutes) data.durationMinutes = this.formData.durationMinutes;

        if (this.isEdit && this.editingId) {
          await this.quizTemplatesStore.updateTemplate(this.editingId, data);
        } else {
          await this.quizTemplatesStore.createTemplate(data);
        }

        this.success = true;
        setTimeout(() => {
          this.handleCancel();
        }, 1500);
      } catch (err: any) {
        this.error = err.message || 'Failed to save template';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      const router = useRouter();
      router.push('/tutor/quiz-templates');
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
