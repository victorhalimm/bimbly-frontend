<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <select
      :id="selectId"
      ref="selectRef"
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

    <p v-if="helperText && !errorMessage" class="text-sm text-gray-500">
      {{ helperText }}
    </p>

    <p v-if="errorMessage" class="text-sm text-error-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export default defineComponent({
  name: 'BSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array as () => SelectOption[],
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
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
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
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const selectRef = ref<HTMLSelectElement | null>(null);
    const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

    const selectClasses = computed(() => {
      const baseClasses = [
        'block',
        'w-full',
        'border',
        'rounded-md',
        'shadow-sm',
        'bg-white',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:border-primary-500',
        'transition-colors',
        'duration-200',
      ];

      const sizeClasses: Record<string, string[]> = {
        sm: ['px-2', 'py-1.5', 'text-sm'],
        md: ['px-3', 'py-2', 'text-sm'],
        lg: ['px-4', 'py-3', 'text-base'],
      };

      const stateClasses = [];
      if (props.disabled) {
        stateClasses.push('bg-gray-50', 'text-gray-500', 'cursor-not-allowed');
      } else if (props.errorMessage) {
        stateClasses.push('border-error-300', 'text-error-900', 'focus:ring-error-500', 'focus:border-error-500');
      } else {
        stateClasses.push('border-gray-300', 'text-gray-900');
      }

      return [
        ...baseClasses,
        ...sizeClasses[props.size],
        ...stateClasses,
      ];
    });

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      emit('update:modelValue', target.value);
    };

    const handleBlur = (event: FocusEvent) => {
      emit('blur', event);
    };

    const handleFocus = (event: FocusEvent) => {
      emit('focus', event);
    };

    const focus = () => {
      selectRef.value?.focus();
    };

    const blur = () => {
      selectRef.value?.blur();
    };

    return {
      selectRef,
      selectId,
      selectClasses,
      handleChange,
      handleBlur,
      handleFocus,
      focus,
      blur,
    };
  },
  methods: {
    focus() {
      this.selectRef?.focus();
    },
    blur() {
      this.selectRef?.blur();
    },
  },
});
</script>