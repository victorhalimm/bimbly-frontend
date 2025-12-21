<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-[2rem] p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-2xl font-black text-gray-900 mb-2">Create Session Summary</h3>
      <p class="text-gray-600 mb-6">Summarize the tutoring session before completing it.</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="flex gap-5">
          <div class="flex-1/2">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Strengths <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.strengths"
              rows="3"
              placeholder="What did the student do well during this session?"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              required
            ></textarea>
          </div>

          <div class="flex-1/2">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Areas for Improvement <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.areasForImprovement"
              rows="3"
              placeholder="What areas need more work or practice?"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Any other observations or comments..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Assign Homework Quiz
          </label>  
          <div v-if="loadingTemplates" class="flex items-center gap-2 text-gray-500 py-3">
            <div class="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Loading quiz templates...</span>
          </div>
          <div v-else-if="quizTemplates.length === 0" class="text-gray-500 py-3">
            No quiz templates available. Create templates in the Quiz section first.
          </div>
          <div v-else class="space-y-3">
            <select
              v-model="form.quizTemplateId"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="">No homework quiz</option>
              <option v-for="template in quizTemplates" :key="template.id" :value="template.id">
                {{ template.title }} ({{ template.subject }} - {{ template.totalPoints }} pts)
              </option>
            </select>
            <div v-if="form.quizTemplateId" class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-600">Deadline:</label>
              <input
                v-model="form.quizDeadline"
                type="datetime-local"
                class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
            <div v-if="selectedTemplate" class="bg-blue-50 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-bold text-blue-800">{{ selectedTemplate.title }}</span>
              </div>
              <div class="text-sm text-blue-700 space-y-1">
                <p v-if="selectedTemplate.description">{{ selectedTemplate.description }}</p>
                <p>{{ selectedTemplate.questions.length }} questions | {{ selectedTemplate.totalPoints }} total points</p>
                <p v-if="selectedTemplate.durationMinutes">Duration: {{ selectedTemplate.durationMinutes }} minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Next Session Plan
          </label>
          <textarea
            v-model="form.nextSessionPlan"
            rows="2"
            placeholder="What topics or areas will be covered in the next session?"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting || !isValid"
            class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Submitting...' : 'Complete Session' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { quizTemplatesService, type QuizTemplate } from '@/services/quiz-templates.service';

export interface SessionFormData {
  strengths: string;
  areasForImprovement: string;
  notes: string;
  quizTemplateId: string;
  quizDeadline: string;
  nextSessionPlan: string;
}

export default defineComponent({
  name: 'CreateSessionSummaryModal',
  props: {
    bookingId: {
      type: String,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        strengths: '',
        areasForImprovement: '',
        notes: '',
        quizTemplateId: '',
        quizDeadline: '',
        nextSessionPlan: '',
      } as SessionFormData,
      quizTemplates: [] as QuizTemplate[],
      loadingTemplates: false,
    };
  },
  computed: {
    isValid(): boolean {
      return (
        this.form.strengths.trim().length > 0 &&
        this.form.areasForImprovement.trim().length > 0
      );
    },
    selectedTemplate(): QuizTemplate | null {
      if (!this.form.quizTemplateId) return null;
      return this.quizTemplates.find(t => t.id === this.form.quizTemplateId) || null;
    },
  },
  mounted() {
    this.loadQuizTemplates();
  },
  methods: {
    async loadQuizTemplates() {
      this.loadingTemplates = true;
      try {
        this.quizTemplates = await quizTemplatesService.getAll();
      } catch {
        this.quizTemplates = [];
      } finally {
        this.loadingTemplates = false;
      }
    },
    handleSubmit() {
      if (!this.isValid) return;
      this.$emit('submit', {
        bookingId: this.bookingId,
        strengths: this.form.strengths.trim(),
        areasForImprovement: this.form.areasForImprovement.trim(),
        notes: this.form.notes.trim() || undefined,
        quizTemplateId: this.form.quizTemplateId || undefined,
        quizDeadline: this.form.quizDeadline || undefined,
        nextSessionPlan: this.form.nextSessionPlan.trim() || undefined,
      });
    },
  },
});
</script>
