<template>
  <div>
    <label v-if="label" :for="selectId" class="block text-lg font-bold text-gray-900 mb-3">
      {{ label }}
      <span v-if="required" class="text-error ml-2">*</span>
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg class="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
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
import { defineComponent, PropType } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectData {
  selectId: string;
  isFocused: boolean;
}

export default defineComponent({
  name: 'NeoSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      required: true,
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
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  data(): SelectData {
    return {
      selectId: `select-${Math.random().toString(36).substr(2, 9)}`,
      isFocused: false,
    };
  },
  computed: {
    selectClasses(): string[] {
      const baseClasses = [
        'w-full',
        'px-6',
        'py-4',
        'pr-12',
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
        'appearance-none',
        'cursor-pointer',
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
  methods: {
    handleChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
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
