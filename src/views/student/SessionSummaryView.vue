<template>
  <div class="session-summary-view p-6 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-gray-900">My Session Summaries</h1>
      <p class="text-gray-600 mt-2">Track your progress and tutor feedback</p>
    </div>

    <div v-if="sessionSummariesStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading summaries...</p>
    </div>

    <div v-else-if="sessionSummariesStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ sessionSummariesStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="summaries.length === 0" class="text-center py-12">
      <NeoCard>
        <div class="py-8">
          <p class="text-gray-500 font-bold text-lg mb-4">
            No session summaries yet
          </p>
          <p class="text-gray-600">
            Your tutor will create summaries after each completed session
          </p>
        </div>
      </NeoCard>
    </div>

    <div v-else class="space-y-6">
      <SummaryCard
        v-for="summary in summaries"
        :key="summary.id"
        :summary="summary"
        :show-actions="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoAlert } from '@/components/common/ui';
import SummaryCard from '@/components/session/SummaryCard.vue';
import { useSessionSummariesStore } from '@/stores/sessionSummaries.store';
import { useAuthStore } from '@/stores/auth.store';

interface SessionSummary {
  id: string;
  bookingId: string;
  strengths: string;
  areasForImprovement: string;
  notes?: string;
  homeworkAssigned?: string;
  nextSessionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export default defineComponent({
  name: 'SessionSummaryView',
  components: { NeoCard, NeoAlert, SummaryCard },
  computed: {
    sessionSummariesStore() {
      return useSessionSummariesStore();
    },

    authStore() {
      return useAuthStore();
    },

    summaries(): SessionSummary[] {
      return this.sessionSummariesStore.summaries;
    },
  },
  async mounted() {
    const studentId = this.authStore.user?.studentProfile?.id;
    if (studentId) {
      await this.sessionSummariesStore.fetchSummariesByStudent(studentId);
    }
  },
});
</script>
