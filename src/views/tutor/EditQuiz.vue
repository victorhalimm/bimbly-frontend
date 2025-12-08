<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Edit <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Quiz</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Update your quiz template</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div v-if="loading && !formData.title" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading quiz...</p>
      </div>

      <div v-else-if="error && !formData.title" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
        <button
          @click="$router.back()"
          class="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>

      <div v-else class="bg-white rounded-[2.5rem] p-8 shadow-xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                Quiz Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="e.g., Chapter 5 Quiz"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">
                Subject <span class="text-red-500">*</span>
              </label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                placeholder="e.g., Mathematics"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Optional description of the quiz"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="duration" class="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                id="duration"
                v-model.number="formData.durationMinutes"
                type="number"
                min="1"
                placeholder="Optional time limit"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label for="gradeLevels" class="block text-sm font-semibold text-gray-700 mb-2">
                Grade Levels <span class="text-red-500">*</span>
              </label>
              <input
                id="gradeLevels"
                v-model="gradeLevelsInput"
                type="text"
                required
                placeholder="e.g., 10,11,12"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input
              id="randomize"
              v-model="formData.randomizeQuestions"
              type="checkbox"
              class="w-5 h-5 text-blue-600 rounded focus:ring-4 focus:ring-blue-100"
            />
            <label for="randomize" class="font-medium text-gray-700">
              Randomize question order for each student
            </label>
          </div>

          <div class="border-t-2 border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-black text-gray-900">Questions</h3>
              <button
                type="button"
                @click="addQuestion"
                class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Question
              </button>
            </div>

            <div v-if="formData.questions.length === 0" class="text-center py-8 text-gray-500">
              <p>No questions yet. Click "Add Question" to get started!</p>
            </div>

            <div v-else class="space-y-4">
              <QuestionBuilder
                v-for="(question, index) in formData.questions"
                :key="index"
                :question="question"
                :index="index"
                @update="updateQuestion(index, $event)"
                @remove="removeQuestion(index)"
              />
            </div>
          </div>

          <div class="bg-blue-50 rounded-2xl p-6">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-bold text-gray-900">Total Questions: {{ formData.questions.length }}</p>
                <p class="text-lg font-bold text-gray-900">Total Points: {{ totalPoints }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="$router.back()"
              class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving || formData.questions.length === 0"
              class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import QuestionBuilder from '../../components/quiz/QuestionBuilder.vue';
import type { QuizQuestion } from '../../services/quiz-templates.service';

interface FormData {
  title: string;
  description: string;
  subject: string;
  gradeLevels: number[];
  questions: QuizQuestion[];
  durationMinutes?: number;
  randomizeQuestions: boolean;
}

interface ComponentData {
  formData: FormData;
  gradeLevelsInput: string;
  saving: boolean;
}

export default defineComponent({
  name: 'EditQuiz',
  components: {
    QuestionBuilder,
  },
  data(): ComponentData {
    return {
      formData: {
        title: '',
        description: '',
        subject: '',
        gradeLevels: [],
        questions: [],
        durationMinutes: undefined,
        randomizeQuestions: false,
      },
      gradeLevelsInput: '',
      saving: false,
    };
  },
  computed: {
    store() {
      return useQuizStore();
    },
    loading(): boolean {
      return this.store.loading;
    },
    error(): string | null {
      return this.store.error;
    },
    totalPoints(): number {
      return this.formData.questions.reduce((sum, q) => sum + q.points, 0);
    },
    templateId(): string {
      return this.$route.params.id as string;
    },
  },
  async mounted() {
    await this.loadTemplate();
  },
  methods: {
    async loadTemplate() {
      try {
        const template = await this.store.fetchTemplate(this.templateId);
        this.formData = {
          title: template.title,
          description: template.description || '',
          subject: template.subject,
          gradeLevels: template.gradeLevels,
          questions: [...template.questions],
          durationMinutes: template.durationMinutes,
          randomizeQuestions: template.randomizeQuestions,
        };
        this.gradeLevelsInput = template.gradeLevels.join(', ');
      } catch (error: any) {
        console.error('Failed to load template:', error);
      }
    },
    addQuestion() {
      this.formData.questions.push({
        questionText: '',
        questionType: 'multiple_choice',
        choices: ['', '', '', ''],
        answerText: '',
        points: 1,
      });
    },
    updateQuestion(index: number, question: QuizQuestion) {
      this.formData.questions[index] = question;
    },
    removeQuestion(index: number) {
      this.formData.questions.splice(index, 1);
    },
    async handleSubmit() {
      const gradeLevels = this.gradeLevelsInput
        .split(',')
        .map((g) => parseInt(g.trim()))
        .filter((g) => !isNaN(g) && g >= 1 && g <= 12);

      if (gradeLevels.length === 0) {
        alert('Please enter valid grade levels (1-12)');
        return;
      }

      this.formData.gradeLevels = gradeLevels;

      this.saving = true;

      try {
        await this.store.updateTemplate(this.templateId, {
          ...this.formData,
          description: this.formData.description || undefined,
          durationMinutes: this.formData.durationMinutes || undefined,
        });
        alert('Quiz updated successfully!');
        this.$router.push('/tutor/quizzes');
      } catch (error: any) {
        alert(error.message || 'Failed to update quiz');
      } finally {
        this.saving = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
