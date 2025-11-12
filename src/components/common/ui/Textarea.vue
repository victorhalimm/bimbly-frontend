<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="textareaId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <textarea
      :id="textareaId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :class="textareaClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>

    <div class="flex justify-between">
      <p v-if="helperText && !errorMessage" class="text-sm text-gray-500">
        {{ helperText }}
      </p>

      <p v-if="showCharacterCount" class="text-sm text-gray-500">
        {{ characterCount }}{{ maxlength ? `/${maxlength}` : '' }}
      </p>
    </div>

    <p v-if="errorMessage" class="text-sm text-error-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'BTextarea',
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
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
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
    errorMessage: {
      type: String,
      default: '',
    },
    helperText: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    showCharacterCount: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: String,
      default: 'vertical',
      validator: (value: string) => ['none', 'vertical', 'horizontal', 'both'].includes(value),
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`);

    const textareaClasses = computed(() => {
      const baseClasses = [
        'block',
        'w-full',
        'border',
        'rounded-md',
        'shadow-sm',
        'placeholder-gray-400',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:border-primary-500',
        'transition-colors',
        'duration-200',
      ];

      const sizeClasses = {
        sm: ['px-2', 'py-1.5', 'text-sm'],
        md: ['px-3', 'py-2', 'text-sm'],
        lg: ['px-4', 'py-3', 'text-base'],
      };

      const resizeClasses = {
        none: ['resize-none'],
        vertical: ['resize-y'],
        horizontal: ['resize-x'],
        both: ['resize'],
      };

      const stateClasses = [];
      if (props.disabled) {
        stateClasses.push('bg-gray-50', 'text-gray-500', 'cursor-not-allowed');
      } else if (props.readonly) {
        stateClasses.push('bg-gray-50', 'text-gray-700');
      } else if (props.errorMessage) {
        stateClasses.push('border-error-300', 'text-error-900', 'placeholder-error-300', 'focus:ring-error-500', 'focus:border-error-500');
      } else {
        stateClasses.push('border-gray-300', 'text-gray-900', 'placeholder-gray-400');
      }

      return [
        ...baseClasses,
        ...sizeClasses[props.size],
        ...resizeClasses[props.resize],
        ...stateClasses,
      ];
    });

    const characterCount = computed(() => props.modelValue?.length || 0);

    const handleInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      emit('update:modelValue', target.value);
    };

    const handleBlur = (event: FocusEvent) => {
      emit('blur', event);
    };

    const handleFocus = (event: FocusEvent) => {
      emit('focus', event);
    };

    const focus = () => {
      textareaRef.value?.focus();
    };

    const blur = () => {
      textareaRef.value?.blur();
    };

    return {
      textareaRef,
      textareaId,
      textareaClasses,
      characterCount,
      handleInput,
      handleBlur,
      handleFocus,
      focus,
      blur,
    };
  },
  methods: {
    focus() {
      this.textareaRef?.focus();
    },
    blur() {
      this.textareaRef?.blur();
    },
  },
});
</script>