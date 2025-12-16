<template>
  <div class="space-y-4">
    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <button
        class="w-full flex items-center justify-between text-left"
        @click="toggleSection('subject')"
      >
        <span class="text-base font-bold text-gray-900">Subject</span>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openSections.subject }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="openSections.subject" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="subject in subjects"
            :key="subject"
            class="px-4 py-2 text-sm rounded-full transition-all font-medium"
            :class="localFilters.subject === subject
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="toggleSubject(subject)"
          >
            {{ subject }}
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <button
        class="w-full flex items-center justify-between text-left"
        @click="toggleSection('grade')"
      >
        <span class="text-base font-bold text-gray-900">Grade Level</span>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openSections.grade }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="openSections.grade" class="mt-4">
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="grade in 12"
            :key="grade"
            class="py-2.5 text-sm rounded-xl transition-all font-medium"
            :class="localFilters.gradeLevel === grade
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="toggleGrade(grade)"
          >
            {{ grade }}
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <button
        class="w-full flex items-center justify-between text-left"
        @click="toggleSection('location')"
      >
        <span class="text-base font-bold text-gray-900">Location</span>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openSections.location }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="openSections.location" class="mt-4 space-y-3">
        <input
          v-model="localFilters.city"
          type="text"
          placeholder="City"
          class="w-full px-4 py-3 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
        />
        <select
          v-model="localFilters.province"
          class="w-full px-4 py-3 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
        >
          <option value="">All Provinces</option>
          <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <button
        class="w-full flex items-center justify-between text-left"
        @click="toggleSection('price')"
      >
        <span class="text-base font-bold text-gray-900">Price Range</span>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openSections.price }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="openSections.price" class="mt-4">
        <div class="flex items-center gap-3">
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">IDR</span>
            <input
              v-model.number="localFilters.minPrice"
              type="number"
              placeholder="Min"
              min="0"
              class="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
            />
          </div>
          <span class="text-gray-300 font-bold">—</span>
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">IDR</span>
            <input
              v-model.number="localFilters.maxPrice"
              type="number"
              placeholder="Max"
              min="0"
              class="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <span class="text-base font-bold text-gray-900 block mb-4">Teaching Method</span>
      <div class="flex gap-2">
        <button
          class="flex-1 py-3 text-sm rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
          :class="!localFilters.teachingMethod
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="localFilters.teachingMethod = undefined"
        >
          All
        </button>
        <button
          class="flex-1 py-3 text-sm rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
          :class="localFilters.teachingMethod === 'online'
            ? 'bg-green-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="localFilters.teachingMethod = 'online'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Online
        </button>
        <button
          class="flex-1 py-3 text-sm rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
          :class="localFilters.teachingMethod === 'offline'
            ? 'bg-yellow-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="localFilters.teachingMethod = 'offline'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          In-Person
        </button>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] p-6 shadow-lg">
      <span class="text-base font-bold text-gray-900 block mb-4">Minimum Rating</span>
      <div class="flex items-center justify-center gap-1">
        <button
          v-for="rating in 5"
          :key="rating"
          class="p-2 rounded-xl transition-all"
          :class="localFilters.minRating === rating ? 'bg-yellow-50' : 'hover:bg-gray-50'"
          @click="setMinRating(rating)"
        >
          <svg
            class="h-7 w-7 transition-colors"
            :class="rating <= (localFilters.minRating || 0) ? 'text-yellow-400' : 'text-gray-200'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      </div>
      <button
        v-if="localFilters.minRating"
        class="mt-2 w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
        @click="clearMinRating"
      >
        Clear
      </button>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        class="flex-1 py-3.5 text-base font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
        @click="clearFilters"
      >
        Clear
      </button>
      <button
        class="flex-1 py-3.5 text-base font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
        @click="applyFilters"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SUBJECT_NAMES, PROVINCE_NAMES } from '@/config';
import type { FilterData } from '@/types/tutor';

export default defineComponent({
  name: 'TutorFilters',
  props: {
    modelValue: {
      type: Object as () => FilterData,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'apply'],
  data() {
    return {
      localFilters: { ...this.modelValue } as FilterData,
      openSections: {
        subject: true,
        grade: false,
        location: false,
        price: false,
      } as Record<string, boolean>,
      subjects: SUBJECT_NAMES,
      provinces: PROVINCE_NAMES,
    };
  },
  watch: {
    modelValue: {
      handler(newVal: FilterData) {
        this.localFilters = { ...newVal };
      },
      deep: true,
    },
  },
  methods: {
    toggleSection(section: string) {
      this.openSections[section] = !this.openSections[section];
    },
    toggleSubject(subject: string) {
      if (this.localFilters.subject === subject) {
        this.localFilters.subject = undefined;
      } else {
        this.localFilters.subject = subject;
      }
    },
    toggleGrade(grade: number) {
      if (this.localFilters.gradeLevel === grade) {
        this.localFilters.gradeLevel = undefined;
      } else {
        this.localFilters.gradeLevel = grade;
      }
    },
    setMinRating(rating: number) {
      if (this.localFilters.minRating === rating) {
        this.localFilters.minRating = undefined;
      } else {
        this.localFilters.minRating = rating;
      }
    },
    clearMinRating() {
      this.localFilters.minRating = undefined;
    },
    applyFilters() {
      const cleanFilters: FilterData = {};

      if (this.localFilters.subject) cleanFilters.subject = this.localFilters.subject;
      if (this.localFilters.gradeLevel) cleanFilters.gradeLevel = this.localFilters.gradeLevel;
      if (this.localFilters.city) cleanFilters.city = this.localFilters.city;
      if (this.localFilters.province) cleanFilters.province = this.localFilters.province;
      if (this.localFilters.minPrice) cleanFilters.minPrice = this.localFilters.minPrice;
      if (this.localFilters.maxPrice) cleanFilters.maxPrice = this.localFilters.maxPrice;
      if (this.localFilters.teachingMethod)
        cleanFilters.teachingMethod = this.localFilters.teachingMethod;
      if (this.localFilters.minRating) cleanFilters.minRating = this.localFilters.minRating;

      this.$emit('update:modelValue', cleanFilters);
      this.$emit('apply');
    },
    clearFilters() {
      this.localFilters = {};
      this.$emit('update:modelValue', {});
      this.$emit('apply');
    },
  },
});
</script>
