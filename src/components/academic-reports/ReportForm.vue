<template>
  <div class="bg-white rounded-[2.5rem] p-8 shadow-xl max-w-4xl mx-auto">
    <div class="relative mb-8">
      <h2 class="text-4xl font-black text-gray-900 text-center">
        {{ isEdit ? 'Edit' : 'Add' }}
        <span class="text-blue-600">Academic</span>
        Report
      </h2>
      <div class="w-24 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="!isEdit">
        <label for="curriculum" class="block text-sm font-semibold text-gray-700 mb-2">
          Curriculum Template (Optional)
        </label>
        <select
          id="curriculum"
          v-model="selectedCurriculum"
          @change="loadCurriculumTemplate"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        >
          <option value="">Custom (No Template)</option>
          <option value="merdeka">Kurikulum Merdeka</option>
          <option value="cambridge">Cambridge</option>
        </select>
      </div>

      <div v-if="!isEdit">
        <label for="grade" class="block text-sm font-semibold text-gray-700 mb-2">
          Grade Level
        </label>
        <select
          id="grade"
          v-model="formData.grade"
          @change="loadCurriculumTemplate"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        >
          <option value="" disabled>Select Grade</option>
          <option v-for="g in 12" :key="g" :value="g">Grade {{ g }}</option>
        </select>
      </div>

      <div v-if="!isEdit">
        <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">
          Subject
        </label>
        <select
          id="subject"
          v-model="formData.subject"
          @change="onSubjectChange"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        >
          <option value="" disabled>Select Subject</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>

      <div class="bg-blue-50 rounded-2xl p-6">
        <h3 class="text-xl font-black text-gray-900 mb-4">Subtopic Scores</h3>

        <div v-if="templateSubtopics.length > 0" class="space-y-4">
          <div v-for="subtopic in templateSubtopics" :key="subtopic" class="flex items-center gap-4">
            <label :for="`score-${subtopic}`" class="flex-1 font-medium text-gray-700">
              {{ subtopic }}
            </label>
            <input
              :id="`score-${subtopic}`"
              v-model.number="formData.subtopicScores[subtopic]"
              type="number"
              min="0"
              max="100"
              required
              class="w-24 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(_score, subtopic, index) in formData.subtopicScores" :key="index" class="flex items-center gap-4">
            <input
              v-model="Object.keys(formData.subtopicScores)[index]"
              type="text"
              placeholder="Subtopic name"
              required
              class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
            <input
              v-model.number="formData.subtopicScores[subtopic]"
              type="number"
              min="0"
              max="100"
              required
              placeholder="Score"
              class="w-24 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              @click="removeSubtopic(subtopic)"
              class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            @click="addSubtopic"
            class="w-full py-3 bg-blue-100 text-blue-600 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
          >
            + Add Subtopic
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Save') }} Report
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAcademicReportsStore } from '../../stores/academic-reports.store';
import { SUBJECT_NAMES } from '@/config';
import type { AcademicReport } from '../../services/academic-reports.service';
import { useToast } from '@/composables/useToast';

export interface ReportFormData {
  grade: number | '';
  subject: string;
  subtopicScores: Record<string, number>;
}

export default defineComponent({
  name: 'ReportForm',
  props: {
    report: {
      type: Object as () => AcademicReport | null,
      default: null,
    },
  },
  emits: ['cancel', 'success'],
  setup() {
    const toast = useToast();
    return { toast };
  },
  data(): {
    formData: ReportFormData;
    selectedCurriculum: string;
    templateSubtopics: string[];
    loading: boolean;
    subjects: string[];
  } {
    return {
      formData: {
        grade: this.report?.grade || '',
        subject: this.report?.subject || '',
        subtopicScores: this.report?.subtopicScores || {},
      },
      selectedCurriculum: '',
      templateSubtopics: [],
      loading: false,
      subjects: SUBJECT_NAMES,
    };
  },
  computed: {
    isEdit(): boolean {
      return !!this.report;
    },
  },
  methods: {
    async loadCurriculumTemplate() {
      if (!this.selectedCurriculum || !this.formData.grade) return;

      const store = useAcademicReportsStore();
      try {
        const template = await store.getCurriculumTemplate(
          this.selectedCurriculum,
          this.formData.grade as number,
        );

        if (this.formData.subject && template.subjects) {
          const subjectTemplate = template.subjects.find(
            (s) => s.name === this.formData.subject,
          );
          if (subjectTemplate) {
            this.templateSubtopics = subjectTemplate.subtopics;
            this.formData.subtopicScores = {};
            subjectTemplate.subtopics.forEach((subtopic) => {
              this.formData.subtopicScores[subtopic] = 0;
            });
          }
        }
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    },

    onSubjectChange() {
      if (this.selectedCurriculum && this.formData.grade) {
        this.loadCurriculumTemplate();
      }
    },

    addSubtopic() {
      const key = `Subtopic ${Object.keys(this.formData.subtopicScores).length + 1}`;
      this.formData.subtopicScores[key] = 0;
    },

    removeSubtopic(subtopic: string) {
      delete this.formData.subtopicScores[subtopic];
    },

    async handleSubmit() {
      this.loading = true;
      const store = useAcademicReportsStore();

      try {
        if (this.isEdit && this.report) {
          await store.updateReport(this.report.id, {
            subtopicScores: this.formData.subtopicScores,
          });
          this.toast.success('Report Updated', 'The academic report has been updated successfully.');
        } else {
          await store.createReport({
            grade: this.formData.grade as number,
            subject: this.formData.subject,
            subtopicScores: this.formData.subtopicScores,
          });
          this.toast.success('Report Created', 'The academic report has been created successfully.');
        }
        this.$emit('success');
      } catch (error: any) {
        this.toast.error('Failed to Save Report', error.message || 'Failed to save report');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
