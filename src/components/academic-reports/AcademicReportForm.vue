<template>
  <div class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
    <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>

    <div class="relative mb-8">
      <h2 class="text-3xl font-black text-gray-900 text-center">
        {{ isEdit ? 'Edit' : 'Add' }}
        <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Academic</span>
        Report
      </h2>
      <div class="w-24 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="!isEdit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
          <select
            v-model="formData.grade"
            @change="onGradeChange"
            required
            class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
          >
            <option value="" disabled>Select Grade</option>
            <option v-for="g in 12" :key="g" :value="g">Grade {{ g }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Entry Method</label>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="entryMethod = 'template'"
              :class="[
                'py-4 px-6 rounded-2xl font-bold transition-all border-2',
                entryMethod === 'template'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              ]"
            >
              <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Use Template
            </button>
            <button
              type="button"
              @click="entryMethod = 'custom'"
              :class="[
                'py-4 px-6 rounded-2xl font-bold transition-all border-2',
                entryMethod === 'custom'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              ]"
            >
              <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Custom Entry
            </button>
          </div>
        </div>

        <div v-if="entryMethod === 'template'" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Curriculum</label>
            <select
              v-model="selectedCurriculum"
              @change="loadCurriculumTemplate"
              required
              class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
            >
              <option value="" disabled>Select Curriculum</option>
              <option value="merdeka">Kurikulum Merdeka</option>
              <option value="cambridge">Cambridge</option>
            </select>
          </div>

          <div v-if="templateSubjects.length > 0">
            <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
            <select
              v-model="selectedTemplateSubject"
              @change="onTemplateSubjectChange"
              required
              class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
            >
              <option value="" disabled>Select Subject</option>
              <option v-for="subj in templateSubjects" :key="subj.name" :value="subj.name">
                {{ subj.name }}
              </option>
            </select>
          </div>

          <div v-if="loadingTemplate" class="text-center py-4">
            <div class="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500 mt-2">Loading curriculum template...</p>
          </div>
        </div>

        <div v-if="entryMethod === 'custom'" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Subject Name</label>
            <input
              v-model="customSubjectName"
              type="text"
              required
              placeholder="e.g., Matematika, Physics, etc."
              class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      <div v-if="isEdit" class="bg-blue-50 rounded-2xl p-4 mb-4">
        <p class="text-sm text-gray-600">
          <span class="font-bold">Subject:</span> {{ report?.subject.name }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-bold">Grade:</span> {{ report?.grade }}
        </p>
      </div>

      <div v-if="showSubtopicSection" class="bg-gray-50 rounded-2xl p-6">
        <h3 class="text-xl font-black text-gray-900 mb-4">Subtopic Scores</h3>
        <p class="text-sm text-gray-500 mb-4">Enter scores between 0-100 for each subtopic</p>

        <div class="space-y-4">
          <div
            v-for="(subtopic, index) in subtopicList"
            :key="index"
            class="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-gray-100"
          >
            <div class="flex-1">
              <input
                v-if="entryMethod === 'custom' && !isEdit"
                v-model="subtopicList[index].name"
                type="text"
                placeholder="Subtopic name"
                required
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900"
              />
              <span v-else class="font-medium text-gray-700">{{ subtopic.name }}</span>
            </div>
            <div class="w-32">
              <input
                v-model.number="subtopicList[index].score"
                type="number"
                min="0"
                max="100"
                required
                placeholder="Score"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 text-center"
              />
            </div>
            <div class="w-16 text-center">
              <span
                class="text-sm font-bold"
                :class="getScoreColor(subtopicList[index].score)"
              >
                {{ getScoreLabel(subtopicList[index].score) }}
              </span>
            </div>
            <button
              v-if="entryMethod === 'custom' && !isEdit && subtopicList.length > 1"
              type="button"
              @click="removeSubtopic(index)"
              class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            v-if="entryMethod === 'custom' && !isEdit"
            type="button"
            @click="addSubtopic"
            class="w-full py-3 bg-blue-100 text-blue-600 rounded-xl font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Subtopic
          </button>
        </div>

        <div v-if="subtopicList.length > 0" class="mt-6 pt-4 border-t-2 border-gray-200">
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-700">Calculated Average</span>
            <span class="text-2xl font-black" :class="getScoreColor(calculatedAverage)">
              {{ calculatedAverage.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="formError" class="bg-red-100 text-red-900 px-5 py-3 rounded-xl">
        <p class="font-medium">{{ formError }}</p>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving || !canSubmit"
          class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {{ saving ? 'Saving...' : (isEdit ? 'Update Report' : 'Save Report') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAcademicReportsStore } from '../../stores/academic-reports.store';
import { subjectsService } from '../../services/subjects.service';
import type { AcademicReport, CurriculumTemplate } from '../../services/academic-reports.service';
import type { SubtopicEntry } from '../../types/academic-reports';

export default defineComponent({
  name: 'AcademicReportForm',
  props: {
    report: {
      type: Object as () => AcademicReport | null,
      default: null,
    },
    subjects: {
      type: Array as () => Array<{ id: string; name: string }>,
      required: true,
    },
    defaultGrade: {
      type: Number,
      default: 10,
    },
  },
  emits: ['cancel', 'success'],
  data(): {
    formData: { grade: number | '' };
    entryMethod: 'template' | 'custom';
    selectedCurriculum: string;
    selectedTemplateSubject: string;
    customSubjectName: string;
    templateSubjects: Array<{ name: string; subtopics: string[] }>;
    subtopicList: SubtopicEntry[];
    loadingTemplate: boolean;
    saving: boolean;
    formError: string | null;
  } {
    return {
      formData: {
        grade: this.report?.grade || this.defaultGrade,
      },
      entryMethod: 'template',
      selectedCurriculum: '',
      selectedTemplateSubject: '',
      customSubjectName: '',
      templateSubjects: [],
      subtopicList: [],
      loadingTemplate: false,
      saving: false,
      formError: null,
    };
  },
  computed: {
    isEdit(): boolean {
      return !!this.report;
    },
    showSubtopicSection(): boolean {
      if (this.isEdit) return true;
      if (this.entryMethod === 'template') {
        return this.selectedTemplateSubject !== '';
      }
      return this.entryMethod === 'custom';
    },
    calculatedAverage(): number {
      if (this.subtopicList.length === 0) return 0;
      const sum = this.subtopicList.reduce((acc, s) => acc + (s.score || 0), 0);
      return sum / this.subtopicList.length;
    },
    canSubmit(): boolean {
      if (this.isEdit) {
        return this.subtopicList.length > 0 && this.subtopicList.every(s => s.score >= 0 && s.score <= 100);
      }
      if (this.entryMethod === 'template') {
        return this.selectedTemplateSubject !== '' && this.subtopicList.length > 0;
      }
      return this.customSubjectName.trim() !== '' && this.subtopicList.length > 0 && this.subtopicList.every(s => s.name.trim() !== '');
    },
  },
  mounted() {
    if (this.isEdit && this.report) {
      this.subtopicList = Object.entries(this.report.subtopicScores).map(([name, score]) => ({
        name,
        score,
      }));
    } else if (this.entryMethod === 'custom') {
      this.subtopicList = [{ name: '', score: 0 }];
    }
  },
  methods: {
    onGradeChange() {
      this.selectedCurriculum = '';
      this.selectedTemplateSubject = '';
      this.templateSubjects = [];
      this.subtopicList = [];
    },
    async loadCurriculumTemplate() {
      if (!this.selectedCurriculum || !this.formData.grade) return;

      this.loadingTemplate = true;
      this.templateSubjects = [];
      this.selectedTemplateSubject = '';
      this.subtopicList = [];

      const store = useAcademicReportsStore();
      try {
        const template: CurriculumTemplate = await store.getCurriculumTemplate(
          this.selectedCurriculum,
          this.formData.grade as number,
        );
        this.templateSubjects = template.subjects || [];
      } catch (error: any) {
        this.formError = error.message || 'Failed to load curriculum template';
      } finally {
        this.loadingTemplate = false;
      }
    },
    onTemplateSubjectChange() {
      const selectedSubject = this.templateSubjects.find(
        (s) => s.name === this.selectedTemplateSubject,
      );
      if (selectedSubject) {
        this.subtopicList = selectedSubject.subtopics.map((name) => ({
          name,
          score: 0,
        }));
      } else {
        this.subtopicList = [];
      }
    },
    addSubtopic() {
      this.subtopicList.push({ name: '', score: 0 });
    },
    removeSubtopic(index: number) {
      this.subtopicList.splice(index, 1);
    },
    getScoreColor(score: number): string {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    },
    getScoreLabel(score: number): string {
      if (score >= 80) return 'A';
      if (score >= 70) return 'B';
      if (score >= 60) return 'C';
      if (score >= 50) return 'D';
      return 'E';
    },
    async handleSubmit() {
      this.saving = true;
      this.formError = null;

      const store = useAcademicReportsStore();

      const subtopicScores: Record<string, number> = {};
      this.subtopicList.forEach((entry) => {
        if (entry.name.trim()) {
          subtopicScores[entry.name.trim()] = entry.score;
        }
      });

      if (Object.keys(subtopicScores).length === 0) {
        this.formError = 'Please add at least one subtopic with a valid name';
        this.saving = false;
        return;
      }

      try {
        if (this.isEdit && this.report) {
          await store.updateReport(this.report.id, { subtopicScores });
        } else {
          const subjectName = this.entryMethod === 'template'
            ? this.selectedTemplateSubject
            : this.customSubjectName.trim();

          let subjectId: string | undefined = this.subjects.find(s => s.name === subjectName)?.id;

          if (!subjectId) {
            const newSubject = await subjectsService.create(subjectName);
            subjectId = newSubject.id;
            await store.fetchSubjects();
          }

          if (!subjectId) {
            this.formError = 'Failed to find or create subject';
            return;
          }

          await store.createReport({
            grade: this.formData.grade as number,
            subjectId: subjectId,
            subtopicScores,
          });
        }
        this.$emit('success');
      } catch (error: any) {
        this.formError = error.response?.data?.message || error.message || 'Failed to save report';
      } finally {
        this.saving = false;
      }
    },
  },
  watch: {
    entryMethod(newVal) {
      if (newVal === 'custom' && this.subtopicList.length === 0) {
        this.subtopicList = [{ name: '', score: 0 }];
      } else if (newVal === 'template') {
        this.subtopicList = [];
        this.customSubjectName = '';
      }
    },
  },
});
</script>
