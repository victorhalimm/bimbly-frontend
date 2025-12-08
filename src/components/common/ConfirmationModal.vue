<template>
  <div v-if="visible" class="fixed inset-0 backdrop-blur-sm bg-gray-500/50 bg-opacity-30 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
      <p class="text-sm text-gray-600 mb-4">
        {{ description }} <strong>{{ targetName }}</strong>. {{ promptText }}
      </p>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ inputLabel }}</label>
        <textarea
          v-model="inputValue"
          :rows="rows"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          :placeholder="placeholder"
        ></textarea>
        <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="handleConfirm"
          :disabled="isProcessing || !isValid"
          class="flex-1 bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ isProcessing ? processingText : confirmText }}
        </button>
        <button
          @click="handleCancel"
          :disabled="isProcessing"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetName: {
      type: String,
      default: '',
    },
    promptText: {
      type: String,
      required: true,
    },
    inputLabel: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    processingText: {
      type: String,
      default: 'Processing...',
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    minLength: {
      type: Number,
      default: 10,
    },
    rows: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      inputValue: '',
      error: '',
    };
  },
  computed: {
    isValid() {
      return this.inputValue.trim().length >= this.minLength;
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.inputValue = '';
        this.error = '';
      }
    },
    inputValue(newVal) {
      if (newVal.trim().length > 0 && newVal.trim().length < this.minLength) {
        this.error = `Must be at least ${this.minLength} characters long`;
      } else {
        this.error = '';
      }
    },
  },
  methods: {
    handleConfirm() {
      if (!this.isValid) {
        this.error = `Must be at least ${this.minLength} characters long`;
        return;
      }
      this.$emit('confirm', this.inputValue.trim());
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
};
</script>
