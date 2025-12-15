<template>
  <div class="bg-white p-6">
    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-1">Weekly Working Hours</h3>
      <p class="text-sm text-gray-500">
        Set working days and hours here to determine when availability appears on calendars
      </p>
    </div>

    <div class="space-y-1">
      <div
        v-for="day in days"
        :key="day.dayOfWeek"
        class="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0"
      >
        <label class="flex items-center gap-3 w-20 shrink-0 cursor-pointer pt-2">
          <input
            type="checkbox"
            :checked="schedule[day.dayOfWeek].enabled"
            @change="toggleDay(day.dayOfWeek)"
            class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span class="font-bold text-gray-900">{{ day.label }}</span>
        </label>

        <div v-if="schedule[day.dayOfWeek].enabled" class="flex-1">
          <div class="space-y-3">
            <div
              v-for="(slot, index) in schedule[day.dayOfWeek].slots"
              :key="index"
              class="flex items-center gap-3 flex-wrap"
            >
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-500 w-16">Start Time</span>
                <input
                  type="time"
                  :value="slot.start"
                  @input="updateSlotTime(day.dayOfWeek, index, 'start', ($event.target as HTMLInputElement).value)"
                  class="px-3 py-2 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                />
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-500 w-16">End Time</span>
                <input
                  type="time"
                  :value="slot.end"
                  @input="updateSlotTime(day.dayOfWeek, index, 'end', ($event.target as HTMLInputElement).value)"
                  class="px-3 py-2 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                />
              </div>

              <div class="flex items-center gap-1">
                <button
                  v-if="index === schedule[day.dayOfWeek].slots.length - 1"
                  type="button"
                  @click="addSlot(day.dayOfWeek)"
                  class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                  title="Add time slot"
                >
                  <IconPlus :size="16" />
                </button>

                <button
                  v-if="schedule[day.dayOfWeek].slots.length > 1"
                  type="button"
                  @click="removeSlot(day.dayOfWeek, index)"
                  class="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                  title="Remove time slot"
                >
                  <IconTrash :size="16" />
                </button>

                <button
                  v-if="index === schedule[day.dayOfWeek].slots.length - 1"
                  type="button"
                  @click="showCopyMenu(day.dayOfWeek)"
                  class="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title="Copy to other days"
                >
                  <IconCopy :size="16" />
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="validationErrors[day.dayOfWeek] && validationErrors[day.dayOfWeek].length > 0"
            class="mt-2"
          >
            <p
              v-for="(error, idx) in validationErrors[day.dayOfWeek]"
              :key="idx"
              class="text-sm text-red-600"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <div v-else class="flex-1 pt-2">
          <span class="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium inline-block">
            Unavailable
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="copyMenuDay !== null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeCopyMenu"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h4 class="text-lg font-bold text-gray-900 mb-4">Copy schedule to</h4>
        <div class="space-y-2 mb-6">
          <label
            v-for="day in days.filter(d => d.dayOfWeek !== copyMenuDay)"
            :key="day.dayOfWeek"
            class="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50"
          >
            <input
              type="checkbox"
              v-model="copyTargetDays"
              :value="day.dayOfWeek"
              class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span class="font-medium text-gray-700">{{ day.fullLabel }}</span>
          </label>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeCopyMenu"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="executeCopy"
            :disabled="copyTargetDays.length === 0"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { IconPlus, IconTrash, IconCopy } from '@tabler/icons-vue';
import type {
  AvailabilitySlot,
  WeekSchedule,
  DayOfWeek,
  DayInfo,
  AvailabilitySchedule,
} from '@/types/availability';

export default defineComponent({
  name: 'WeeklyAvailabilityInput',
  components: {
    IconPlus,
    IconTrash,
    IconCopy,
  },
  props: {
    modelValue: {
      type: Array as PropType<AvailabilitySchedule | null>,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      schedule: {
        0: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        1: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        2: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        3: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        4: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        5: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
        6: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
      } as WeekSchedule,
      days: [
        { dayOfWeek: 0, label: 'Sun', fullLabel: 'Sunday' },
        { dayOfWeek: 1, label: 'Mon', fullLabel: 'Monday' },
        { dayOfWeek: 2, label: 'Tue', fullLabel: 'Tuesday' },
        { dayOfWeek: 3, label: 'Wed', fullLabel: 'Wednesday' },
        { dayOfWeek: 4, label: 'Thu', fullLabel: 'Thursday' },
        { dayOfWeek: 5, label: 'Fri', fullLabel: 'Friday' },
        { dayOfWeek: 6, label: 'Sat', fullLabel: 'Saturday' },
      ] as DayInfo[],
      validationErrors: {} as Record<number, string[]>,
      copyMenuDay: null as DayOfWeek | null,
      copyTargetDays: [] as DayOfWeek[],
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue: AvailabilitySchedule | null) {
        if (newValue && newValue.length > 0) {
          this.parseModelValue(newValue);
        }
      },
    },
  },
  methods: {
    parseModelValue(slots: AvailabilitySchedule) {
      for (let day = 0; day <= 6; day++) {
        const daySlots = slots.filter(s => s.dayOfWeek === day);
        if (daySlots.length > 0) {
          this.schedule[day as DayOfWeek] = {
            enabled: true,
            slots: daySlots.map(slot => ({ start: slot.start, end: slot.end })),
          };
        } else {
          this.schedule[day as DayOfWeek] = {
            enabled: false,
            slots: [{ start: '09:00', end: '17:00' }],
          };
        }
      }
    },

    emitSchedule() {
      const result: AvailabilitySlot[] = [];
      for (let day = 0; day <= 6; day++) {
        const daySchedule = this.schedule[day as DayOfWeek];
        if (daySchedule.enabled) {
          for (const slot of daySchedule.slots) {
            result.push({
              start: slot.start,
              end: slot.end,
              dayOfWeek: day,
            });
          }
        }
      }
      this.$emit('update:modelValue', result.length > 0 ? result : null);
    },

    toggleDay(day: DayOfWeek) {
      this.schedule[day].enabled = !this.schedule[day].enabled;
      if (this.schedule[day].enabled && this.schedule[day].slots.length === 0) {
        this.schedule[day].slots = [{ start: '09:00', end: '17:00' }];
      }
      this.validateDay(day);
      this.emitSchedule();
    },

    addSlot(day: DayOfWeek) {
      const lastSlot = this.schedule[day].slots[this.schedule[day].slots.length - 1];
      const newStart = lastSlot ? this.addHours(lastSlot.end, 1) : '09:00';
      const newEnd = this.addHours(newStart, 2);
      this.schedule[day].slots.push({ start: newStart, end: newEnd });
      this.validateDay(day);
      this.emitSchedule();
    },

    removeSlot(day: DayOfWeek, index: number) {
      if (this.schedule[day].slots.length > 1) {
        this.schedule[day].slots.splice(index, 1);
        this.validateDay(day);
        this.emitSchedule();
      }
    },

    updateSlotTime(day: DayOfWeek, index: number, field: 'start' | 'end', value: string) {
      this.schedule[day].slots[index][field] = value;
      this.validateDay(day);
      this.emitSchedule();
    },

    addHours(time: string, hours: number): string {
      const [h, m] = time.split(':').map(Number);
      let newHours = h + hours;
      if (newHours >= 24) newHours = 23;
      return `${String(newHours).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    },

    timeToMinutes(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    },

    slotsOverlap(slot1: { start: string; end: string }, slot2: { start: string; end: string }): boolean {
      const start1 = this.timeToMinutes(slot1.start);
      const end1 = this.timeToMinutes(slot1.end);
      const start2 = this.timeToMinutes(slot2.start);
      const end2 = this.timeToMinutes(slot2.end);
      return start1 < end2 && start2 < end1;
    },

    validateDay(day: DayOfWeek) {
      const errors: string[] = [];
      const slots = this.schedule[day].slots;

      if (!this.schedule[day].enabled) {
        this.validationErrors[day] = [];
        return;
      }

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (!slot.start || !slot.end) continue;

        const startMinutes = this.timeToMinutes(slot.start);
        const endMinutes = this.timeToMinutes(slot.end);

        if (startMinutes >= endMinutes) {
          errors.push(`Slot ${i + 1}: Start time must be before end time`);
        }

        for (let j = i + 1; j < slots.length; j++) {
          if (this.slotsOverlap(slot, slots[j])) {
            errors.push(`Slots ${i + 1} and ${j + 1} overlap`);
          }
        }
      }

      this.validationErrors[day] = errors;
    },

    showCopyMenu(day: DayOfWeek) {
      this.copyMenuDay = day;
      this.copyTargetDays = [];
    },

    closeCopyMenu() {
      this.copyMenuDay = null;
      this.copyTargetDays = [];
    },

    executeCopy() {
      if (this.copyMenuDay === null) return;

      const sourceSchedule = this.schedule[this.copyMenuDay];
      for (const targetDay of this.copyTargetDays) {
        this.schedule[targetDay] = {
          enabled: sourceSchedule.enabled,
          slots: sourceSchedule.slots.map(slot => ({ ...slot })),
        };
        this.validateDay(targetDay);
      }

      this.closeCopyMenu();
      this.emitSchedule();
    },
  },
});
</script>
