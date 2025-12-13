<template>
  <button
    type="button"
    class="px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2"
    :class="chipClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ slot.start }} - {{ slot.end }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { TimeSlot } from '@/services/tutor.service';

export default defineComponent({
  name: 'TimeSlotChip',
  props: {
    slot: {
      type: Object as PropType<TimeSlot>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    chipClasses(): string {
      if (this.disabled) {
        return 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed';
      }
      if (this.selected) {
        return 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100';
      }
      return 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-gray-50';
    },
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click', this.slot);
      }
    },
  },
});
</script>
