<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
      <div v-if="!completed" class="text-center">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Confirm Session Completion</h3>
        <p class="text-gray-600 mb-6">
          The tutor has marked this session as completed. Please confirm that the session took place as scheduled.
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
            @click="handleConfirm"
          >
            {{ submitting ? 'Confirming...' : 'Confirm' }}
          </button>
        </div>
      </div>

      <div v-else class="text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Session Completed!</h3>
        <p class="text-gray-600 mb-6">
          Thank you for confirming. Would you like to leave a review for your tutor?
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="handleClose"
          >
            Maybe Later
          </button>
          <button
            class="flex-1 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition-colors"
            @click="handleReview"
          >
            Write Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StudentCompleteModal',
  props: {
    bookingId: {
      type: String,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'confirm', 'review'],
  data() {
    return {
      completed: false,
    };
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm', this.bookingId);
    },
    handleClose() {
      this.$emit('close');
    },
    handleReview() {
      this.$emit('review', this.bookingId);
    },
    markAsCompleted() {
      this.completed = true;
    },
  },
});
</script>
