<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-gray-900 mb-4">
          Assign <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Quiz</span>
        </h1>
        <p class="text-lg font-medium text-gray-600">Assign this quiz to a student</p>
        <div class="w-32 h-1 bg-blue-500 rounded-full mx-auto mt-4"></div>
      </div>

      <div v-if="loading && !template" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading quiz...</p>
      </div>

      <div v-else-if="error && !template" class="bg-red-100 text-red-900 px-6 py-4 rounded-2xl">
        <p class="font-medium">{{ error }}</p>
        <button
          @click="$router.back()"
          class="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>

      <template v-else>
        <div class="bg-white rounded-[2.5rem] p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-black text-gray-900 mb-2">{{ template?.title }}</h2>
          <p v-if="template?.description" class="text-gray-600 mb-4">{{ template.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-sm">
              {{ template?.subject }}
            </span>
            <span class="px-4 py-2 bg-gray-200 text-gray-900 rounded-full font-bold text-sm">
              {{ template?.questions.length }} Questions
            </span>
            <span class="px-4 py-2 bg-green-100 text-green-900 rounded-full font-bold text-sm">
              {{ template?.totalPoints }} Points
            </span>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="studentId" class="block text-sm font-semibold text-gray-700 mb-2">
                Student <span class="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                v-model="formData.studentId"
                required
                :disabled="loadingStudents"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                <option value="" disabled>
                  {{ loadingStudents ? 'Loading students...' : 'Select a student' }}
                </option>
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.fullName }}
                </option>
              </select>
              <p v-if="students.length === 0 && !loadingStudents" class="mt-2 text-sm text-yellow-600">
                No students found. You need to have completed sessions with students first.
              </p>
            </div>

            <div>
              <label for="sessionId" class="block text-sm font-semibold text-gray-700 mb-2">
                Session ID (Optional)
              </label>
              <input
                id="sessionId"
                v-model="formData.sessionId"
                type="text"
                placeholder="Link to a tutoring session"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label for="deadline" class="block text-sm font-semibold text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <input
                id="deadline"
                v-model="formData.deadline"
                type="datetime-local"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div v-if="submitError" class="bg-red-100 text-red-900 px-4 py-3 rounded-xl">
              <p class="font-medium">{{ submitError }}</p>
            </div>

            <div v-if="submitSuccess" class="bg-green-100 text-green-900 px-4 py-3 rounded-xl">
              <p class="font-medium">Quiz assigned successfully!</p>
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
                :disabled="submitting"
                class="flex-1 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                {{ submitting ? 'Assigning...' : 'Assign Quiz' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import { studentService } from '../../services/student.service';
import type { QuizTemplate } from '../../services/quiz-templates.service';
import type { TutoredStudent } from '../../services/student.service';

interface FormData {
  studentId: string;
  sessionId: string;
  deadline: string;
}

interface ComponentData {
  formData: FormData;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  students: TutoredStudent[];
  loadingStudents: boolean;
}

export default defineComponent({
  name: 'AssignQuiz',
  data(): ComponentData {
    return {
      formData: {
        studentId: '',
        sessionId: '',
        deadline: '',
      },
      submitting: false,
      submitError: null,
      submitSuccess: false,
      students: [],
      loadingStudents: false,
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
    templateId(): string {
      return this.$route.params.id as string;
    },
    template(): QuizTemplate | undefined {
      return this.store.templateById(this.templateId);
    },
  },
  async mounted() {
    if (!this.template) {
      await this.store.fetchTemplate(this.templateId);
    }
    await this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      this.loadingStudents = true;
      try {
        this.students = await studentService.getTutoredStudents();
      } catch (error: any) {
        console.error('Failed to fetch students:', error);
      } finally {
        this.loadingStudents = false;
      }
    },
    async handleSubmit() {
      this.submitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      try {
        await this.store.assignQuiz({
          quizTemplateId: this.templateId,
          studentId: this.formData.studentId,
          sessionId: this.formData.sessionId || undefined,
          deadline: this.formData.deadline || undefined,
        });
        this.submitSuccess = true;
        this.formData = {
          studentId: '',
          sessionId: '',
          deadline: '',
        };
      } catch (error: any) {
        this.submitError = error.response?.data?.message || error.message || 'Failed to assign quiz';
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>

<style scoped>
</style>
