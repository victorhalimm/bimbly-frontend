<template>
  <NeoCard class="summary-card">
    <div class="space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-black text-gray-900">Session Summary</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ formattedDate }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="border-l-4 border-success-500 pl-4 py-2">
          <h4 class="text-sm font-black text-success-700 uppercase mb-2">
            Strengths
          </h4>
          <p class="text-gray-700">{{ summary.strengths }}</p>
        </div>

        <div class="border-l-4 border-warning-500 pl-4 py-2">
          <h4 class="text-sm font-black text-warning-700 uppercase mb-2">
            Areas for Improvement
          </h4>
          <p class="text-gray-700">{{ summary.areasForImprovement }}</p>
        </div>

        <div v-if="summary.notes" class="border-l-4 border-primary-500 pl-4 py-2">
          <h4 class="text-sm font-black text-primary-700 uppercase mb-2">
            Notes
          </h4>
          <p class="text-gray-700">{{ summary.notes }}</p>
        </div>

        <div v-if="summary.homeworkAssigned" class="border-l-4 border-error-500 pl-4 py-2">
          <h4 class="text-sm font-black text-error-700 uppercase mb-2">
            Homework Assigned
          </h4>
          <p class="text-gray-700">{{ summary.homeworkAssigned }}</p>
        </div>

        <div v-if="summary.nextSessionPlan" class="border-l-4 border-gray-500 pl-4 py-2">
          <h4 class="text-sm font-black text-gray-700 uppercase mb-2">
            Next Session Plan
          </h4>
          <p class="text-gray-700">{{ summary.nextSessionPlan }}</p>
        </div>
      </div>

      <div v-if="showActions" class="flex space-x-2 pt-4 border-t-2 border-gray-200">
        <NeoButton
          variant="secondary"
          size="sm"
          @click="handleEdit"
        >
          Edit
        </NeoButton>
        <NeoButton
          variant="error"
          size="sm"
          @click="handleDelete"
        >
          Delete
        </NeoButton>
      </div>
    </div>
  </NeoCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { NeoCard, NeoButton } from '@/components/common/ui';

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
  name: 'SummaryCard',
  components: { NeoCard, NeoButton },
  props: {
    summary: {
      type: Object as PropType<SessionSummary>,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedDate(): string {
      const date = new Date(this.summary.createdAt);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  methods: {
    handleEdit(): void {
      this.$emit('edit', this.summary);
    },

    handleDelete(): void {
      this.$emit('delete', this.summary.id);
    },
  },
  emits: ['edit', 'delete'],
});
</script>

<style scoped>
.summary-card {
  transition: transform 0.2s ease-in-out;
}

.summary-card:hover {
  transform: translateY(-2px);
}
</style>
