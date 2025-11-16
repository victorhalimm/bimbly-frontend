<template>
  <NeoCard>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <h2 class="text-3xl font-black text-gray-900">
        {{ isEdit ? 'Edit Academic Report' : 'Add Academic Report' }}
      </h2>

      <div v-if="!isEdit" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Grade Level
          </label>
          <NeoSelect
            v-model="formData.grade"
            :options="gradeOptions"
            placeholder="Select grade"
            :disabled="isEdit"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Curriculum Template (Optional)
          </label>
          <NeoSelect
            v-model="selectedCurriculum"
            :options="curriculumOptions"
            placeholder="Choose template or skip"
            @update:modelValue="handleCurriculumChange"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Subject
          </label>
          <NeoSelect
            v-if="templateSubjects.length > 0"
            v-model="selectedTemplateSubject"
            :options="templateSubjects"
            placeholder="Select subject from template"
            @update:modelValue="handleTemplateSubjectChange"
            required
          />
          <NeoSelect
            v-else
            v-model="formData.subjectId"
            :options="subjectOptions"
            placeholder="Select subject"
            required
          />
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-bold text-gray-700">
            Subtopic Scores
          </label>
          <NeoButton
            v-if="!selectedTemplateSubject"
            type="button"
            variant="secondary"
            size="sm"
            @click="addCustomSubtopic"
          >
            + Add Subtopic
          </NeoButton>
        </div>

        <div v-if="subtopicList.length === 0" class="text-center py-8">
          <p class="text-gray-500 font-bold">
            No subtopics added yet
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(subtopic, index) in subtopicList"
            :key="index"
            class="flex items-center space-x-2"
          >
            <div class="flex-1">
              <NeoInput
                v-if="subtopic.isCustom"
                v-model="subtopic.name"
                placeholder="Subtopic name"
                required
              />
              <label v-else class="block text-sm font-bold text-gray-700">
                {{ subtopic.name }}
              </label>
            </div>
            <div class="w-24">
              <NeoInput
                v-model.number="subtopic.score"
                type="number"
                min="0"
                max="100"
                placeholder="Score"
                required
              />
            </div>
            <NeoButton
              v-if="subtopic.isCustom"
              type="button"
              variant="error"
              size="sm"
              @click="removeSubtopic(index)"
            >
              ×
            </NeoButton>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-4">
        <NeoAlert variant="error" :message="error">
          {{ error }}
        </NeoAlert>
      </div>

      <div class="flex space-x-4 pt-4">
        <NeoButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !canSubmit"
        >
          {{ isLoading ? 'Saving...' : 'Save Report' }}
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { NeoCard, NeoButton, NeoInput, NeoSelect, NeoAlert } from '@/components/common/ui';
import { useSubjectsStore } from '@/stores/subjects.store';
import { useAcademicReportsStore } from '@/stores/academicReports.store';

interface SubtopicScores {
  [subtopic: string]: number;
}

interface Subject {
  id: string;
  name: string;
}

interface SubtopicItem {
  name: string;
  score: number;
  isCustom: boolean;
}

interface FormData {
  grade: number | null;
  subjectId: string;
  subtopicScores: SubtopicScores;
}

interface ComponentData {
  formData: FormData;
  selectedCurriculum: string;
  selectedTemplateSubject: string;
  templateSubtopics: string[];
  subtopicList: SubtopicItem[];
  isLoading: boolean;
  error: string | null;
}

export default defineComponent({
  name: 'ReportForm',
  components: { NeoCard, NeoButton, NeoInput, NeoSelect, NeoAlert },
  props: {
    initialData: {
      type: Object as PropType<{
        grade: number;
        subject: Subject;
        subtopicScores: SubtopicScores;
      }>,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data(): ComponentData {
    return {
      formData: {
        grade: this.initialData?.grade || null,
        subjectId: this.initialData?.subject?.id || '',
        subtopicScores: {},
      },
      selectedCurriculum: '',
      selectedTemplateSubject: '',
      templateSubtopics: [],
      subtopicList: [],
      isLoading: false,
      error: null,
    };
  },
  computed: {
    subjectsStore() {
      return useSubjectsStore();
    },

    academicReportsStore() {
      return useAcademicReportsStore();
    },

    gradeOptions() {
      return Array.from({ length: 12 }, (_, i) => ({
        label: `Grade ${i + 1}`,
        value: i + 1,
      }));
    },

    curriculumOptions() {
      return [
        { label: 'Kurikulum Merdeka', value: 'merdeka' },
        { label: 'Cambridge', value: 'cambridge' },
        { label: 'Custom (No Template)', value: '' },
      ];
    },

    subjectOptions() {
      return this.subjectsStore.subjects.map((subject) => ({
        label: subject.name,
        value: subject.id,
      }));
    },

    templateSubjects() {
      if (!this.academicReportsStore.curriculumTemplate) return [];
      return this.academicReportsStore.curriculumTemplate.subjects.map((subject) => ({
        label: subject.name,
        value: subject.name,
      }));
    },

    canSubmit(): boolean {
      return (
        (this.isEdit || (this.formData.grade !== null && this.formData.subjectId !== '')) &&
        this.subtopicList.length > 0 &&
        this.subtopicList.every((s) => s.name && s.score >= 0 && s.score <= 100)
      );
    },
  },
  async mounted() {
    await this.subjectsStore.fetchSubjects();

    if (this.initialData) {
      this.subtopicList = Object.entries(this.initialData.subtopicScores).map(
        ([name, score]) => ({
          name,
          score,
          isCustom: false,
        })
      );
    }
  },
  methods: {
    async handleCurriculumChange() {
      if (!this.selectedCurriculum || !this.formData.grade) return;

      this.isLoading = true;
      this.error = null;
      try {
        await this.academicReportsStore.fetchCurriculumTemplate(
          this.selectedCurriculum,
          this.formData.grade
        );
      } catch (err: any) {
        this.error = err.message || 'Failed to load curriculum template';
      } finally {
        this.isLoading = false;
      }
    },

    handleTemplateSubjectChange() {
      if (!this.academicReportsStore.curriculumTemplate) return;

      const subject = this.academicReportsStore.curriculumTemplate.subjects.find(
        (s) => s.name === this.selectedTemplateSubject
      );

      if (subject) {
        const subjectEntity = this.subjectsStore.getSubjectByName(subject.name);
        if (subjectEntity) {
          this.formData.subjectId = subjectEntity.id;
        }

        this.templateSubtopics = subject.subtopics;
        this.subtopicList = subject.subtopics.map((name) => ({
          name,
          score: 0,
          isCustom: false,
        }));
      }
    },

    addCustomSubtopic() {
      this.subtopicList.push({
        name: '',
        score: 0,
        isCustom: true,
      });
    },

    removeSubtopic(index: number) {
      this.subtopicList.splice(index, 1);
    },

    async handleSubmit() {
      this.isLoading = true;
      this.error = null;

      try {
        const subtopicScores: SubtopicScores = {};
        this.subtopicList.forEach((item) => {
          subtopicScores[item.name] = item.score;
        });

        this.formData.subtopicScores = subtopicScores;

        if (this.isEdit) {
          this.$emit('submit', subtopicScores);
        } else {
          this.$emit('submit', {
            grade: this.formData.grade,
            subjectId: this.formData.subjectId,
            subtopicScores,
          });
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to save report';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      this.$emit('cancel');
    },
  },
  emits: ['submit', 'cancel'],
});
</script>
