<template>
  <div class="assign-quiz-page p-6 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">Assign Quiz</h1>
      <p class="text-gray-600 mt-2">Assign a quiz template to a student</p>
    </div>

    <NeoCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Quiz Template *
          </label>
          <NeoSelect
            v-model="formData.quizTemplateId"
            :options="templateOptions"
            placeholder="Select quiz template"
            required
          />
          <div v-if="selectedTemplate" class="mt-3 p-4 bg-primary-50 border-2 border-black rounded-xl">
            <p class="text-sm font-bold text-gray-900">{{ selectedTemplate.title }}</p>
            <p class="text-xs text-gray-600 mt-1">
              {{ selectedTemplate.problemIds.length }} questions • {{ selectedTemplate.totalPoints }} points
              <span v-if="selectedTemplate.durationMinutes">
                • {{ selectedTemplate.durationMinutes }} minutes
              </span>
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Student *
          </label>
          <NeoInput
            v-model="formData.studentId"
            placeholder="Enter student ID"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            You can find the student ID from your student list or booking history
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Session (Optional)
          </label>
          <NeoInput
            v-model="formData.sessionId"
            placeholder="Link to a specific tutoring session"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Deadline (Optional)
          </label>
          <NeoInput
            v-model="formData.deadline"
            type="datetime-local"
            placeholder="Set a deadline for submission"
          />
        </div>

        <div v-if="error" class="mt-4">
          <NeoAlert variant="error">
            {{ error }}
          </NeoAlert>
        </div>

        <div v-if="success" class="mt-4">
          <NeoAlert variant="success">
            Quiz assigned successfully! The student can now access it from their dashboard.
          </NeoAlert>
        </div>

        <div class="flex space-x-4 pt-4">
          <NeoButton
            type="submit"
            variant="primary"
            :disabled="isLoading || !canSubmit || success"
          >
            {{ isLoading ? 'Assigning...' : 'Assign Quiz' }}
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton, NeoInput, NeoSelect, NeoAlert } from '@/components/common/ui';
import { useQuizTemplatesStore } from '@/stores/quizTemplates.store';
import { useQuizAssignmentsStore } from '@/stores/quizAssignments.store';
import { useRouter, useRoute } from 'vue-router';

interface QuizTemplate {
  id: string;
  title: string;
  problemIds: string[];
  totalPoints: number;
  durationMinutes?: number;
}

interface FormData {
  quizTemplateId: string;
  studentId: string;
  sessionId: string;
  deadline: string;
}

interface ComponentData {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default defineComponent({
  name: 'AssignQuiz',
  components: { NeoCard, NeoButton, NeoInput, NeoSelect, NeoAlert },
  data(): ComponentData {
    return {
      formData: {
        quizTemplateId: '',
        studentId: '',
        sessionId: '',
        deadline: '',
      },
      isLoading: false,
      error: null,
      success: false,
    };
  },
  computed: {
    quizTemplatesStore() {
      return useQuizTemplatesStore();
    },

    quizAssignmentsStore() {
      return useQuizAssignmentsStore();
    },

    templateOptions() {
      return this.quizTemplatesStore.templates.map((template) => ({
        label: `${template.title} (${template.problemIds.length} questions)`,
        value: template.id,
      }));
    },

    selectedTemplate(): QuizTemplate | null {
      if (!this.formData.quizTemplateId) return null;
      return this.quizTemplatesStore.getTemplateById(this.formData.quizTemplateId) || null;
    },

    canSubmit(): boolean {
      return this.formData.quizTemplateId !== '' && this.formData.studentId !== '';
    },
  },
  async mounted() {
    await this.quizTemplatesStore.fetchTemplates();

    const route = useRoute();
    const templateId = route.query.templateId as string;
    if (templateId) {
      this.formData.quizTemplateId = templateId;
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.canSubmit) return;

      this.isLoading = true;
      this.error = null;
      this.success = false;

      try {
        const data: any = {
          quizTemplateId: this.formData.quizTemplateId,
          studentId: this.formData.studentId,
        };

        if (this.formData.sessionId) data.sessionId = this.formData.sessionId;
        if (this.formData.deadline) data.deadline = new Date(this.formData.deadline).toISOString();

        await this.quizAssignmentsStore.createAssignment(data);

        this.success = true;
        setTimeout(() => {
          this.handleCancel();
        }, 2000);
      } catch (err: any) {
        this.error = err.message || 'Failed to assign quiz';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      const router = useRouter();
      router.back();
    },
  },
});
</script>
