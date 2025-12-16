<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 rounded-xl border border-red-200">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <div v-else-if="slots.length === 0" class="p-6 bg-gray-50 rounded-xl text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500 font-medium">No available slots for this date</p>
      <p class="text-gray-400 text-sm mt-1">Please try selecting a different date</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <TimeSlotChip
          v-for="(slot, index) in slots"
          :key="`${slot.start}-${slot.end}`"
          :slot="slot"
          :selected="isSlotSelected(index)"
          @click="handleSlotClick(index)"
        />
      </div>

      <div v-if="selectedIndices.length > 0" class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-700">
              <span class="font-bold">Selected:</span>
              {{ selectedTimeRange }}
            </p>
            <p class="text-xs text-blue-600 mt-1">
              {{ selectedIndices.length }} {{ selectedIndices.length === 1 ? 'hour' : 'hours' }} session
            </p>
          </div>
          <button
            type="button"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            @click="clearSelection"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { tutorService } from '@/services/tutor.service';
import type { TimeSlot } from '@/services/tutor.service';
import TimeSlotChip from './TimeSlotChip.vue';

export default defineComponent({
  name: 'TimeSlotSelector',
  components: {
    TimeSlotChip,
  },
  props: {
    tutorId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  emits: ['update:selectedSlots', 'update:startTime', 'update:durationHours'],
  data() {
    return {
      slots: [] as TimeSlot[],
      selectedIndices: [] as number[],
      loading: false,
      error: null as string | null,
    };
  },
  computed: {
    selectedSlots(): TimeSlot[] {
      return this.selectedIndices.map(i => this.slots[i]);
    },
    selectedTimeRange(): string {
      if (this.selectedIndices.length === 0) return '';
      const sortedIndices = [...this.selectedIndices].sort((a, b) => a - b);
      const firstSlot = this.slots[sortedIndices[0]];
      const lastSlot = this.slots[sortedIndices[sortedIndices.length - 1]];
      return `${firstSlot.start} - ${lastSlot.end}`;
    },
    startTime(): string {
      if (this.selectedIndices.length === 0) return '';
      const sortedIndices = [...this.selectedIndices].sort((a, b) => a - b);
      return this.slots[sortedIndices[0]].start;
    },
    durationHours(): number {
      return this.selectedIndices.length;
    },
  },
  watch: {
    date: {
      immediate: true,
      handler() {
        this.fetchSlots();
      },
    },
    tutorId() {
      this.fetchSlots();
    },
    selectedIndices: {
      deep: true,
      handler() {
        this.$emit('update:selectedSlots', this.selectedSlots);
        this.$emit('update:startTime', this.startTime);
        this.$emit('update:durationHours', this.durationHours);
      },
    },
  },
  methods: {
    async fetchSlots() {
      if (!this.tutorId || !this.date) return;

      this.loading = true;
      this.error = null;
      this.selectedIndices = [];

      try {
        const response = await tutorService.getAvailableSlots(this.tutorId, this.date);
        this.slots = response.slots.length > 0 ? response.slots : this.getMockSlots();
      } catch {
        this.slots = this.getMockSlots();
      } finally {
        this.loading = false;
      }
    },
    getMockSlots(): TimeSlot[] {
      return [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '19:00', end: '20:00' },
        { start: '20:00', end: '21:00' },
      ];
    },
    isSlotSelected(index: number): boolean {
      return this.selectedIndices.includes(index);
    },
    handleSlotClick(index: number) {
      if (this.selectedIndices.length === 0) {
        this.selectedIndices = [index];
        return;
      }

      const sortedIndices = [...this.selectedIndices].sort((a, b) => a - b);
      const minIndex = sortedIndices[0];
      const maxIndex = sortedIndices[sortedIndices.length - 1];

      if (this.selectedIndices.includes(index)) {
        if (index === minIndex) {
          this.selectedIndices = this.selectedIndices.filter(i => i !== index);
        } else if (index === maxIndex) {
          this.selectedIndices = this.selectedIndices.filter(i => i !== index);
        } else {
          this.selectedIndices = this.selectedIndices.filter(i => i <= index - 1 || i === minIndex);
        }
        return;
      }

      if (index === minIndex - 1) {
        this.selectedIndices = [index, ...this.selectedIndices];
      } else if (index === maxIndex + 1) {
        this.selectedIndices = [...this.selectedIndices, index];
      } else {
        this.selectedIndices = [index];
      }
    },
    clearSelection() {
      this.selectedIndices = [];
    },
  },
});
</script>
