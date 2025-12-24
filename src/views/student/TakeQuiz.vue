  <template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-gray-600">Loading quiz...</p>
      </div>

      <div v-else-if="!assignment || !quizTemplate" class="text-center py-12">
        <p class="text-xl font-bold text-gray-600">Quiz not found</p>
      </div>

      <div v-else>
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl mb-6">
          <h1 class="text-4xl font-black text-gray-900 mb-4">{{ quizTemplate.title }}</h1>
          <p v-if="quizTemplate.description" class="text-lg text-gray-600 mb-4">{{ quizTemplate.description }}</p>

          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-bold text-blue-900">
                {{ quizTemplate.durationMinutes ? `${quizTemplate.durationMinutes} minutes` : 'No time limit' }}
              </span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-bold text-green-900">{{ quizTemplate.questions.length }} Questions</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span class="font-bold text-yellow-900">{{ quizTemplate.totalPoints }} Points</span>
            </div>
          </div>
        </div>

        <div v-if="assignment.status === 'assigned'">
          <div class="bg-white rounded-[2.5rem] p-12 shadow-xl text-center">
            <svg class="w-24 h-24 text-blue-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-3xl font-black text-gray-900 mb-4">Ready to Start?</h2>
            <p class="text-lg text-gray-600 mb-8">Once you begin, the timer will start and you cannot pause.</p>
            <button
              @click="startQuiz"
              :disabled="loadingAction"
              class="inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
            >
              {{ loadingAction ? 'Starting...' : 'Start Quiz' }}
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div v-else-if="assignment.status === 'in_progress'">
          <form @submit.prevent="submitQuiz" class="space-y-6">
            <div
              v-for="(question, index) in quizTemplate.questions"
              :key="index"
              class="bg-white rounded-[2.5rem] p-8 shadow-lg"
            >
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-black text-gray-900">Question {{ index + 1 }}</h3>
                <span class="px-4 py-2 bg-yellow-100 text-yellow-900 rounded-full font-bold">
                  {{ question.points }} {{ question.points === 1 ? 'point' : 'points' }}
                </span>
              </div>

              <p class="text-lg font-medium text-gray-700 mb-6">{{ question.questionText }}</p>

              <div v-if="question.questionType === 'multiple_choice'" class="space-y-3">
                <label
                  v-for="(choice, i) in question.choices"
                  :key="i"
                  class="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <input
                    v-model="answers[index]"
                    :value="choice"
                    type="radio"
                    :name="`question-${index}`"
                    class="w-5 h-5 text-blue-600"
                  />
                  <span class="font-medium text-gray-900">{{ choice }}</span>
                </label>
              </div>

              <div v-else>
                <textarea
                  v-model="answers[index]"
                  :placeholder="question.questionType === 'essay' ? 'Write your answer here...' : 'Enter your answer'"
                  :rows="question.questionType === 'essay' ? 6 : 3"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div class="flex gap-4">
              <button
                type="button"
                @click="saveProgress"
                :disabled="loadingAction"
                class="flex-1 py-4 bg-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                {{ loadingAction ? 'Saving...' : 'Save Progress' }}
              </button>
              <button
                type="submit"
                :disabled="loadingAction"
                class="flex-1 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                {{ loadingAction ? 'Submitting...' : 'Submit Quiz' }}
              </button>
            </div>
          </form>
        </div>

        <div v-else>
          <div class="bg-white rounded-[2.5rem] p-12 shadow-xl text-center">
            <svg class="w-24 h-24 text-green-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-3xl font-black text-gray-900 mb-4">Quiz Submitted!</h2>
            <p class="text-lg text-gray-600 mb-8">Your answers have been submitted for grading.</p>
            <button
              @click="$router.push('/student/quizzes')"
              class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <SimpleConfirmModal
      v-if="showSubmitConfirm"
      title="Submit Quiz"
      message="Are you sure you want to submit? You cannot change your answers after submission."
      confirm-text="Submit"
      cancel-text="Cancel"
      variant="warning"
      :loading="submittingQuiz"
      @confirm="confirmSubmit"
      @cancel="cancelSubmit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuizStore } from '../../stores/quiz.store';
import { useToast } from '@/composables/useToast';
import SimpleConfirmModal from '../../components/common/SimpleConfirmModal.vue';

export default defineComponent({
  name: 'TakeQuiz',
  components: {
    SimpleConfirmModal,
  },
  data() {
    return {
      answers: {} as Record<number, string>,
      loadingAction: false,
      showSubmitConfirm: false,
      submittingQuiz: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    store() {
      return useQuizStore();
    },
    loading(): boolean {
      return this.store.loading;
    },
    assignment() {
      return this.store.currentAssignment;
    },
    quizTemplate() {
      return this.assignment?.quizTemplate;
    },
  },
  async mounted() {
    const assignmentId = this.$route.params.id as string;
    if (assignmentId) {
      await this.store.fetchAssignment(assignmentId);
      await this.loadSavedAnswers();
    }
  },
  methods: {
    async startQuiz() {
      if (!this.assignment) return;

      this.loadingAction = true;
      try {
        await this.store.startQuiz(this.assignment.id);
        await this.store.fetchAssignment(this.assignment.id);
        this.toast.success('Quiz Started', 'Good luck with your quiz!');
      } catch (error: any) {
        this.toast.error('Failed to Start Quiz', error.message || 'Failed to start quiz');
      } finally {
        this.loadingAction = false;
      }
    },
    async loadSavedAnswers() {
      if (!this.assignment) return;

      try {
        const savedAnswers = await this.store.fetchAnswers(this.assignment.id);
        savedAnswers.forEach((answer) => {
          this.answers[answer.questionIndex] = answer.studentAnswer;
        });
      } catch (error) {
        console.error('Failed to load saved answers:', error);
      }
    },
    async saveProgress() {
      if (!this.assignment) return;

      this.loadingAction = true;
      try {
        for (const [index, answer] of Object.entries(this.answers)) {
          await this.store.saveAnswer({
            assignmentId: this.assignment.id,
            questionIndex: parseInt(index),
            studentAnswer: answer,
          });
        }
        this.toast.success('Progress Saved', 'Your answers have been saved successfully.');
      } catch (error: any) {
        this.toast.error('Failed to Save Progress', error.message || 'Failed to save progress');
      } finally {
        this.loadingAction = false;
      }
    },
    submitQuiz() {
      this.showSubmitConfirm = true;
    },
    async confirmSubmit() {
      if (!this.assignment) return;

      this.submittingQuiz = true;
      try {
        await this.saveProgress();
        await this.store.submitQuiz(this.assignment.id);
        await this.store.fetchAssignment(this.assignment.id);
        this.toast.success('Quiz Submitted', 'Your quiz has been submitted successfully for grading.');
      } catch (error: any) {
        this.toast.error('Failed to Submit Quiz', error.message || 'Failed to submit quiz');
      } finally {
        this.submittingQuiz = false;
        this.showSubmitConfirm = false;
      }
    },
    cancelSubmit() {
      this.showSubmitConfirm = false;
    },
  },
});
</script>

<style scoped>
</style>
