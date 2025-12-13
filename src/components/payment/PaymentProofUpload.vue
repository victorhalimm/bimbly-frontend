<template>
  <div class="bg-white rounded-2xl border-2 border-gray-100 p-6">
    <h3 class="font-bold text-gray-900 mb-4">Upload Payment Proof</h3>

    <div
      class="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
      :class="isDragging
        ? 'border-blue-500 bg-blue-50'
        : previewUrl
          ? 'border-green-500 bg-green-50'
          : 'border-gray-300 hover:border-gray-400'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="previewUrl" class="space-y-4">
        <img
          :src="previewUrl"
          alt="Payment proof preview"
          class="max-h-64 mx-auto rounded-lg shadow-md"
        />
        <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
          <IconFile class="w-4 h-4" />
          <span>{{ fileName }}</span>
          <button
            type="button"
            class="text-red-600 hover:text-red-700 ml-2"
            @click="clearFile"
          >
            <IconX class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <IconUpload class="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <p class="text-gray-600 font-medium">Drag and drop your payment proof here</p>
          <p class="text-sm text-gray-400 mt-1">or</p>
        </div>
        <label class="inline-block">
          <input
            type="file"
            accept="image/jpeg,image/png"
            class="hidden"
            @change="handleFileSelect"
          />
          <span class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            Browse Files
          </span>
        </label>
        <p class="text-xs text-gray-400">JPG or PNG, max 5MB</p>
      </div>
    </div>

    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <button
      v-if="previewUrl && !uploading"
      type="button"
      class="w-full mt-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      @click="handleUpload"
    >
      <IconCheck class="w-5 h-5" />
      Upload Payment Proof
    </button>

    <button
      v-if="uploading"
      type="button"
      class="w-full mt-6 py-4 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
      disabled
    >
      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Uploading...
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconUpload,
  IconFile,
  IconX,
  IconCheck,
} from '@tabler/icons-vue';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export default defineComponent({
  name: 'PaymentProofUpload',
  components: {
    IconUpload,
    IconFile,
    IconX,
    IconCheck,
  },
  props: {
    uploading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['upload'],
  data() {
    return {
      file: null as File | null,
      previewUrl: null as string | null,
      fileName: '',
      isDragging: false,
      error: null as string | null,
    };
  },
  methods: {
    handleDrop(event: DragEvent) {
      this.isDragging = false;
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        this.processFile(files[0]);
      }
    },
    handleFileSelect(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.processFile(input.files[0]);
      }
    },
    processFile(file: File) {
      this.error = null;

      if (!ALLOWED_TYPES.includes(file.type)) {
        this.error = 'Only JPG and PNG files are allowed';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        this.error = 'File size must be less than 5MB';
        return;
      }

      this.file = file;
      this.fileName = file.name;
      this.previewUrl = URL.createObjectURL(file);
    },
    clearFile() {
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
      }
      this.file = null;
      this.previewUrl = null;
      this.fileName = '';
      this.error = null;
    },
    handleUpload() {
      if (this.file) {
        this.$emit('upload', this.file);
      }
    },
  },
  beforeUnmount() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  },
});
</script>
