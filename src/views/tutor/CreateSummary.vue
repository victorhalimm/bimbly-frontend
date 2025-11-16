<template>
  <div class="create-summary-page p-6 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">Create Session Summary</h1>
      <p class="text-gray-600 mt-2">Document student progress and feedback</p>
    </div>

    <NeoCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Strengths *
          </label>
          <NeoTextarea
            v-model="formData.strengths"
            placeholder="What did the student do well? (e.g., excellent understanding of concepts, good problem-solving skills)"
            rows="4"
            required
            :minlength="10"
            :maxlength="2000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.strengths.length }} / 2000 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Areas for Improvement *
          </label>
          <NeoTextarea
            v-model="formData.areasForImprovement"
            placeholder="What areas need more work? (e.g., needs practice with word problems, focus on time management)"
            rows="4"
            required
            :minlength="10"
            :maxlength="2000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.areasForImprovement.length }} / 2000 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Additional Notes
          </label>
          <NeoTextarea
            v-model="formData.notes"
            placeholder="Any other observations or comments about the session (optional)"
            rows="3"
            :maxlength="2000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.notes?.length || 0 }} / 2000 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Homework Assigned
          </label>
          <NeoTextarea
            v-model="formData.homeworkAssigned"
            placeholder="Describe any homework or practice assignments (optional)"
            rows="3"
            :maxlength="1000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.homeworkAssigned?.length || 0 }} / 1000 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Next Session Plan
          </label>
          <NeoTextarea
            v-model="formData.nextSessionPlan"
            placeholder="What topics will be covered in the next session? (optional)"
            rows="3"
            :maxlength="1000"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.nextSessionPlan?.length || 0 }} / 1000 characters
          </p>
        </div>

        <div v-if="error" class="mt-4">
          <NeoAlert variant="error">
            {{ error }}
          </NeoAlert>
        </div>

        <div v-if="success" class="mt-4">
          <NeoAlert variant="success">
            Session summary created successfully!
          </NeoAlert>
        </div>

        <div class="flex space-x-4 pt-4">
          <NeoButton
            type="submit"
            variant="primary"
            :disabled="isLoading || !canSubmit"
          >
            {{ isLoading ? 'Saving...' : 'Create Summary' }}
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
import { NeoCard, NeoButton, NeoTextarea, NeoAlert } from '@/components/common/ui';
import { useSessionSummariesStore } from '@/stores/sessionSummaries.store';
import { useRouter, useRoute } from 'vue-router';

interface FormData {
  bookingId: string;
  strengths: string;
  areasForImprovement: string;
  notes: string;
  homeworkAssigned: string;
  nextSessionPlan: string;
}

interface ComponentData {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default defineComponent({
  name: 'CreateSummary',
  components: { NeoCard, NeoButton, NeoTextarea, NeoAlert },
  data(): ComponentData {
    return {
      formData: {
        bookingId: '',
        strengths: '',
        areasForImprovement: '',
        notes: '',
        homeworkAssigned: '',
        nextSessionPlan: '',
      },
      isLoading: false,
      error: null,
      success: false,
    };
  },
  computed: {
    sessionSummariesStore() {
      return useSessionSummariesStore();
    },

    canSubmit(): boolean {
      return (
        this.formData.strengths.length >= 10 &&
        this.formData.areasForImprovement.length >= 10
      );
    },
  },
  mounted() {
    const route = useRoute();
    const bookingId = route.query.bookingId as string;
    if (bookingId) {
      this.formData.bookingId = bookingId;
    } else {
      this.error = 'Booking ID is required';
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
          bookingId: this.formData.bookingId,
          strengths: this.formData.strengths,
          areasForImprovement: this.formData.areasForImprovement,
        };

        if (this.formData.notes) data.notes = this.formData.notes;
        if (this.formData.homeworkAssigned) data.homeworkAssigned = this.formData.homeworkAssigned;
        if (this.formData.nextSessionPlan) data.nextSessionPlan = this.formData.nextSessionPlan;

        await this.sessionSummariesStore.createSummary(data);

        this.success = true;
        setTimeout(() => {
          this.handleCancel();
        }, 2000);
      } catch (err: any) {
        this.error = err.message || 'Failed to create summary';
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
