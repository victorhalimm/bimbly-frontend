<template>
  <div class="problems-list-page p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-black text-gray-900">Question Bank</h1>
        <p class="text-gray-600 mt-2">Manage your reusable quiz questions</p>
      </div>
      <NeoButton
        variant="primary"
        @click="goToCreateProblem"
      >
        + Create Problem
      </NeoButton>
    </div>

    <div class="mb-6">
      <NeoSelect
        v-model="filterType"
        :options="filterOptions"
        placeholder="Filter by type"
      />
    </div>

    <div v-if="problemsStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-bold">Loading problems...</p>
    </div>

    <div v-else-if="problemsStore.error" class="py-12">
      <NeoAlert variant="error">
        {{ problemsStore.error }}
      </NeoAlert>
    </div>

    <div v-else-if="filteredProblems.length === 0" class="text-center py-12">
      <NeoCard>
        <div class="py-8">
          <p class="text-gray-500 font-bold text-lg mb-4">
            {{ filterType ? 'No problems of this type' : 'No problems yet' }}
          </p>
          <NeoButton variant="primary" @click="goToCreateProblem">
            Create Your First Problem
          </NeoButton>
        </div>
      </NeoCard>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProblemCard
        v-for="problem in filteredProblems"
        :key="problem.id"
        :problem="problem"
        :show-answer="true"
        :show-actions="true"
        @edit="handleEdit"
        @delete="confirmDelete"
      />
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
          Are you sure you want to delete this problem? This action cannot be undone.
        </p>
        <div class="flex space-x-4">
          <NeoButton
            variant="error"
            @click="handleDelete"
            :disabled="problemsStore.isLoading"
          >
            {{ problemsStore.isLoading ? 'Deleting...' : 'Delete' }}
          </NeoButton>
          <NeoButton
            variant="secondary"
            @click="cancelDelete"
            :disabled="problemsStore.isLoading"
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
import { NeoButton, NeoCard, NeoSelect, NeoAlert } from '@/components/common/ui';
import ProblemCard from '@/components/quiz/ProblemCard.vue';
import { useProblemsStore } from '@/stores/problems.store';
import { useRouter } from 'vue-router';

type QuestionType = 'multiple_choice' | 'essay' | 'short_answer';

interface Problem {
  id: string;
  questionText: string;
  answerText: string;
  questionType: QuestionType;
  choices?: string[];
  points: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ComponentData {
  filterType: QuestionType | '';
  showDeleteConfirm: boolean;
  deletingProblemId: string | null;
}

export default defineComponent({
  name: 'ProblemsList',
  components: { NeoButton, NeoCard, NeoSelect, NeoAlert, ProblemCard },
  data(): ComponentData {
    return {
      filterType: '',
      showDeleteConfirm: false,
      deletingProblemId: null,
    };
  },
  computed: {
    problemsStore() {
      return useProblemsStore();
    },

    filteredProblems(): Problem[] {
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
  },
  async mounted() {
    await this.problemsStore.fetchProblems();
  },
  methods: {
    goToCreateProblem() {
      const router = useRouter();
      router.push('/tutor/problems/create');
    },

    handleEdit(problem: Problem) {
      const router = useRouter();
      router.push(`/tutor/problems/edit/${problem.id}`);
    },

    confirmDelete(problemId: string) {
      this.deletingProblemId = problemId;
      this.showDeleteConfirm = true;
    },

    cancelDelete() {
      this.deletingProblemId = null;
      this.showDeleteConfirm = false;
    },

    async handleDelete() {
      if (!this.deletingProblemId) return;

      try {
        await this.problemsStore.deleteProblem(this.deletingProblemId);
        this.cancelDelete();
      } catch (error) {
        console.error('Failed to delete problem:', error);
      }
    },
  },
});
</script>
