<template>
  <div class="space-y-4">
    <label v-if="label" class="block text-lg font-bold text-gray-900 mb-3">
      {{ label }}
    </label>
    <div class="flex gap-4">
      <label
        v-for="option in options"
        :key="option.value"
        class="relative flex items-center cursor-pointer group"
      >
        <input
          :id="`${inputId}-${option.value}`"
          :checked="modelValue === option.value"
          :value="option.value"
          :name="name"
          :disabled="disabled"
          type="radio"
          class="sr-only"
          @change="handleChange"
        />

        <!-- Custom Radio Button -->
        <div class="relative">
          <div :class="radioClasses(option.value)">
            <div
              v-if="modelValue === option.value"
              class="absolute inset-0 rounded-full border-4 border-black"
            >
              <div class="w-full h-full rounded-full bg-primary flex items-center justify-center">
                <div class="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Label -->
        <span
          :for="`${inputId}-${option.value}`"
          class="ml-3 text-lg font-bold transition-all duration-200"
          :class="{
            'text-primary': modelValue === option.value,
            'text-gray-900 group-hover:text-gray-700': modelValue !== option.value,
          }"
        >
          {{ option.label }}
        </span>
      </label>
    </div>

    <!-- Helper Text -->
    <div v-if="helperText" class="text-sm text-gray-600">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export interface RadioOption {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: 'NeoRadio',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array as () => RadioOption[],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    name: {
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputId = ref(`radio-${Math.random().toString(36).substr(2, 9)}`);

    const radioClasses = (value: string | number) => {
      const baseClasses = [
        'w-8',
        'h-8',
        'border-4',
        'border-black',
        'rounded-full',
        'transition-all',
        'duration-200',
        'relative',
      ];

      if (props.disabled) {
        baseClasses.push('bg-gray-100', 'cursor-not-allowed');
      } else if (props.modelValue === value) {
        baseClasses.push('bg-white');
      } else {
        baseClasses.push('bg-white', 'hover:border-primary', 'cursor-pointer');
      }

      return baseClasses;
    };

    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    return {
      inputId,
      radioClasses,
      handleChange,
    };
  },
});
</script>