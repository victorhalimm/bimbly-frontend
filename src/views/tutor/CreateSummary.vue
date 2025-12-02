<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Create <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Session</span> Summary
        </h1>
        <p class="text-lg font-medium text-gray-600">Document student progress and feedback</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="strengths" class="block text-sm font-semibold text-gray-700 mb-2">
              Strengths <span class="text-red-500">*</span>
            </label>
            <textarea
              id="strengths"
              v-model="formData.strengths"
              required
              rows="4"
              placeholder="What did the student do well?"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label for="areasForImprovement" class="block text-sm font-semibold text-gray-700 mb-2">
              Areas for Improvement <span class="text-red-500">*</span>
            </label>
            <textarea
              id="areasForImprovement"
              v-model="formData.areasForImprovement"
              required
              rows="4"
              placeholder="What should the student focus on next?"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label for="notes" class="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              placeholder="Any other observations or comments"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label for="homeworkAssigned" class="block text-sm font-semibold text-gray-700 mb-2">
              Homework Assigned
            </label>
            <textarea
              id="homeworkAssigned"
              v-model="formData.homeworkAssigned"
              rows="3"
              placeholder="Describe the homework tasks"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label for="nextSessionPlan" class="block text-sm font-semibold text-gray-700 mb-2">
              Next Session Plan
            </label>
            <textarea
              id="nextSessionPlan"
              v-model="formData.nextSessionPlan"
              rows="3"
              placeholder="What will you cover in the next session?"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
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
              :disabled="loading"
              class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Create Summary' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionSummariesStore } from '../../stores/session-summaries.store';
import type { CreateSessionSummaryDto } from '../../services/session-summaries.service';

interface FormData {
  strengths: string;
  areasForImprovement: string;
  notes: string;
  homeworkAssigned: string;
  nextSessionPlan: string;
}

export default defineComponent({
  name: 'CreateSummary',
  data(): { formData: FormData; loading: boolean } {
    return {
      formData: {
        strengths: '',
        areasForImprovement: '',
        notes: '',
        homeworkAssigned: '',
        nextSessionPlan: '',
      },
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      const bookingId = this.$route.params.bookingId as string;
      if (!bookingId) {
        alert('Booking ID is required');
        return;
      }

      this.loading = true;
      const store = useSessionSummariesStore();

      try {
        const data: CreateSessionSummaryDto = {
          bookingId,
          ...this.formData,
        };
        await store.createSummary(data);
        alert('Session summary created successfully!');
        this.$router.back();
      } catch (error: any) {
        alert(error.message || 'Failed to create summary');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
