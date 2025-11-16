<template>
  <div class="create-problem-page p-6 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">
        {{ isEdit ? 'Edit Problem' : 'Create Problem' }}
      </h1>
      <p class="text-gray-600 mt-2">Add a new question to your question bank</p>
    </div>

    <NeoCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Question Type *
          </label>
          <NeoSelect
            v-model="formData.questionType"
            :options="questionTypeOptions"
            placeholder="Select question type"
            required
            :disabled="isEdit"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Question Text *
          </label>
          <NeoTextarea
            v-model="formData.questionText"
            placeholder="Enter the question"
            rows="4"
            required
            :maxlength="5000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.questionText.length }} / 5000 characters
          </p>
        </div>

        <div v-if="formData.questionType === 'multiple_choice'" class="space-y-4">
          <label class="block text-sm font-bold text-gray-700">
            Answer Choices *
          </label>
          <div
            v-for="(choice, index) in formData.choices"
            :key="index"
            class="flex items-center space-x-2"
          >
            <NeoInput
              v-model="formData.choices[index]"
              :placeholder="`Choice ${String.fromCharCode(65 + index)}`"
              required
            />
            <NeoButton
              v-if="formData.choices.length > 2"
              type="button"
              variant="error"
              size="sm"
              @click="removeChoice(index)"
            >
              ×
            </NeoButton>
          </div>
          <NeoButton
            v-if="formData.choices.length < 6"
            type="button"
            variant="secondary"
            size="sm"
            @click="addChoice"
          >
            + Add Choice
          </NeoButton>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Correct Answer *
          </label>
          <NeoSelect
            v-if="formData.questionType === 'multiple_choice'"
            v-model="formData.answerText"
            :options="choiceOptions"
            placeholder="Select correct answer"
            required
          />
          <NeoTextarea
            v-else
            v-model="formData.answerText"
            placeholder="Enter the correct answer or sample answer"
            rows="4"
            required
            :maxlength="5000"
          />
          <p v-if="formData.questionType !== 'multiple_choice'" class="text-xs text-gray-500 mt-1">
            {{ formData.answerText.length }} / 5000 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Points *
          </label>
          <NeoInput
            v-model.number="formData.points"
            type="number"
            min="1"
            max="100"
            placeholder="Points for this question"
            required
          />
        </div>

        <div v-if="error" class="mt-4">
          <NeoAlert variant="error">
            {{ error }}
          </NeoAlert>
        </div>

        <div v-if="success" class="mt-4">
          <NeoAlert variant="success">
            Problem {{ isEdit ? 'updated' : 'created' }} successfully!
          </NeoAlert>
        </div>

        <div class="flex space-x-4 pt-4">
          <NeoButton
            type="submit"
            variant="primary"
            :disabled="isLoading || !canSubmit || success"
          >
            {{ isLoading ? 'Saving...' : (isEdit ? 'Update Problem' : 'Create Problem') }}
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
import { NeoCard, NeoButton, NeoInput, NeoSelect, NeoTextarea, NeoAlert } from '@/components/common/ui';
import { useProblemsStore } from '@/stores/problems.store';
import { useRouter, useRoute } from 'vue-router';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface FormData {
  questionText: string;
  answerText: string;
  questionType: QuestionType | '';
  choices: string[];
  points: number;
}

interface ComponentData {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  isEdit: boolean;
  editingId: string | null;
}

export default defineComponent({
  name: 'CreateProblem',
  components: { NeoCard, NeoButton, NeoInput, NeoSelect, NeoTextarea, NeoAlert },
  data(): ComponentData {
    return {
      formData: {
        questionText: '',
        answerText: '',
        questionType: '',
        choices: ['', '', '', ''],
        points: 1,
      },
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

    questionTypeOptions() {
      return [
        { label: 'Multiple Choice', value: 'multiple_choice' },
        { label: 'Essay', value: 'essay' },
        { label: 'Short Answer', value: 'short_answer' },
      ];
    },

    choiceOptions() {
      return this.formData.choices
        .filter((c) => c.trim() !== '')
        .map((choice) => ({
          label: choice,
          value: choice,
        }));
    },

    canSubmit(): boolean {
      if (!this.formData.questionText || !this.formData.answerText || !this.formData.questionType) {
        return false;
      }
      if (this.formData.questionType === 'multiple_choice') {
        const validChoices = this.formData.choices.filter((c) => c.trim() !== '');
        return validChoices.length >= 2 && validChoices.includes(this.formData.answerText);
      }
      return true;
    },
  },
  async mounted() {
    const route = useRoute();
    const problemId = route.params.id as string;
    if (problemId) {
      this.isEdit = true;
      this.editingId = problemId;
      await this.loadProblem(problemId);
    }
  },
  methods: {
    async loadProblem(id: string) {
      this.isLoading = true;
      try {
        const problem = await this.problemsStore.fetchProblemById(id);
        this.formData = {
          questionText: problem.questionText,
          answerText: problem.answerText,
          questionType: problem.questionType,
          choices: problem.choices || ['', '', '', ''],
          points: problem.points,
        };
      } catch (err: any) {
        this.error = err.message || 'Failed to load problem';
      } finally {
        this.isLoading = false;
      }
    },

    addChoice() {
      if (this.formData.choices.length < 6) {
        this.formData.choices.push('');
      }
    },

    removeChoice(index: number) {
      if (this.formData.choices.length > 2) {
        this.formData.choices.splice(index, 1);
      }
    },

    async handleSubmit() {
      if (!this.canSubmit) return;

      this.isLoading = true;
      this.error = null;
      this.success = false;

      try {
        const data: any = {
          questionText: this.formData.questionText,
          answerText: this.formData.answerText,
          questionType: this.formData.questionType,
          points: this.formData.points,
        };

        if (this.formData.questionType === 'multiple_choice') {
          data.choices = this.formData.choices.filter((c) => c.trim() !== '');
        }

        if (this.isEdit && this.editingId) {
          await this.problemsStore.updateProblem(this.editingId, data);
        } else {
          await this.problemsStore.createProblem(data);
        }

        this.success = true;
        setTimeout(() => {
          this.handleCancel();
        }, 1500);
      } catch (err: any) {
        this.error = err.message || 'Failed to save problem';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      const router = useRouter();
      router.push('/tutor/problems');
    },
  },
});
</script>
