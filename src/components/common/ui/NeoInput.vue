<template>
  <div>
    <label v-if="label" :for="inputId" class="block text-lg font-bold text-gray-900 mb-3">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Icon for validation states -->
      <div v-if="showValidationIcon" class="absolute inset-y-0 right-0 flex items-center pr-4">
        <svg v-if="errorMessage" class="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else-if="isValid && modelValue" class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-3 flex items-center space-x-2">
      <svg class="w-5 h-5 text-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      <span class="text-lg font-medium text-error">{{ errorMessage }}</span>
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !errorMessage" class="mt-3 text-sm text-gray-600">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'NeoInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => ['text', 'email', 'password', 'tel', 'url'].includes(value),
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
    autocomplete: {
      type: String,
      default: '',
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    showValidationIcon: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);
    const isFocused = ref(false);

    const inputClasses = computed(() => {
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
      ];

      if (props.disabled) {
        baseClasses.push('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
      } else if (props.errorMessage) {
        baseClasses.push('bg-error-50', 'text-gray-900', 'border-error');
      } else if (props.isValid) {
        baseClasses.push('bg-success-50', 'text-gray-900', 'border-success');
      } else if (isFocused.value) {
        baseClasses.push('bg-white', 'text-gray-900', 'border-primary', 'shadow-lg');
      } else {
        baseClasses.push('bg-white', 'text-gray-900', 'hover:border-gray-800');
      }

      return baseClasses;
    });

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    const handleBlur = (event: FocusEvent) => {
      isFocused.value = false;
      emit('blur', event);
    };

    const handleFocus = (event: FocusEvent) => {
      isFocused.value = true;
      emit('focus', event);
    };

    return {
      inputId,
      inputClasses,
      handleInput,
      handleBlur,
      handleFocus,
    };
  },
});
</script>