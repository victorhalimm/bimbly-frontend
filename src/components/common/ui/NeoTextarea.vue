<template>
  <div>
    <label v-if="label" :for="textareaId" class="block text-lg font-bold text-gray-900 mb-3">
      {{ label }}
      <span v-if="required" class="text-error ml-2">*</span>
    </label>
    <div class="relative">
      <textarea
        :id="textareaId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :maxlength="maxlength"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>
    </div>

    <div v-if="showCharacterCount && maxlength" class="mt-2 text-right">
      <span class="text-sm font-medium text-gray-600">
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>

    <div v-if="errorMessage" class="mt-3 flex items-center space-x-2">
      <svg class="w-5 h-5 text-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      <span class="text-lg font-medium text-error">{{ errorMessage }}</span>
    </div>

    <div v-if="helperText && !errorMessage" class="mt-3 text-sm text-gray-600">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface TextareaData {
  textareaId: string;
  isFocused: boolean;
  characterCount: number;
}

export default defineComponent({
  name: 'NeoTextarea',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    helperText: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 4,
    },
    maxlength: {
      type: Number,
      default: null,
    },
    showCharacterCount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  data(): TextareaData {
    return {
      textareaId: `textarea-${Math.random().toString(36).substr(2, 9)}`,
      isFocused: false,
      characterCount: this.modelValue?.length || 0,
    };
  },
  computed: {
    textareaClasses(): string[] {
      const baseClasses = [
        'w-full',
        'px-6',
        'py-4',
        'text-lg',
        'font-medium',
        'border-4',
        'border-black',
        'rounded-lg',
        'transition-all',
        'duration-200',
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-black',
        'focus:ring-opacity-25',
        'resize-vertical',
      ];

      if (this.disabled) {
        baseClasses.push('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
      } else if (this.errorMessage) {
        baseClasses.push('bg-error-50', 'text-gray-900', 'border-error');
      } else if (this.isFocused) {
        baseClasses.push('bg-white', 'text-gray-900', 'border-primary', 'shadow-lg');
      } else {
        baseClasses.push('bg-white', 'text-gray-900', 'hover:border-gray-800');
      }

      return baseClasses;
    },
  },
  watch: {
    modelValue(newValue) {
      this.characterCount = newValue?.length || 0;
    },
  },
  methods: {
    handleInput(event: Event): void {
      const target = event.target as HTMLTextAreaElement;
      this.characterCount = target.value.length;
      this.$emit('update:modelValue', target.value);
    },
    handleBlur(event: FocusEvent): void {
      this.isFocused = false;
      this.$emit('blur', event);
    },
    handleFocus(event: FocusEvent): void {
      this.isFocused = true;
      this.$emit('focus', event);
    },
  },
});
</script>
