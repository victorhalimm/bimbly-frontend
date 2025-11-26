<template>
  <div class="bg-white border-4 border-black rounded-2xl shadow-2xl p-6">
    <h3 class="text-xl font-black text-gray-900 mb-6">Filter Tutors</h3>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
        <select
          v-model="localFilters.subject"
          class="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          <option value="">All Subjects</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
        <select
          v-model="localFilters.gradeLevel"
          class="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          <option :value="undefined">All Grades</option>
          <option v-for="grade in 12" :key="grade" :value="grade">Grade {{ grade }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">City</label>
        <input
          v-model="localFilters.city"
          type="text"
          placeholder="Enter city name"
          class="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Province</label>
        <select
          v-model="localFilters.province"
          class="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          <option value="">All Provinces</option>
          <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          Price Range (IDR/hour)
        </label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="localFilters.minPrice"
            type="number"
            placeholder="Min"
            min="0"
            class="w-full px-3 py-2 border-4 border-black rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
          />
          <span class="font-bold">-</span>
          <input
            v-model.number="localFilters.maxPrice"
            type="number"
            placeholder="Max"
            min="0"
            class="w-full px-3 py-2 border-4 border-black rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Teaching Method</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="localFilters.teachingMethod"
              :value="undefined"
              class="w-5 h-5 border-4 border-black"
            />
            <span class="font-semibold">All Methods</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="localFilters.teachingMethod"
              value="online"
              class="w-5 h-5 border-4 border-black"
            />
            <span class="font-semibold">Online Only</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="localFilters.teachingMethod"
              value="offline"
              class="w-5 h-5 border-4 border-black"
            />
            <span class="font-semibold">Offline Only</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Minimum Rating</label>
        <div class="flex items-center gap-2">
          <button
            v-for="rating in 5"
            :key="rating"
            class="p-2 rounded-lg transition-all"
            :class="
              localFilters.minRating === rating
                ? 'bg-warning-100 border-2 border-warning-500'
                : 'hover:bg-gray-100'
            "
            @click="setMinRating(rating)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              :class="
                rating <= (localFilters.minRating || 0) ? 'text-warning-500' : 'text-gray-300'
              "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
          <button
            v-if="localFilters.minRating"
            class="text-sm text-gray-500 hover:text-gray-700 font-semibold"
            @click="clearMinRating"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 space-y-3">
      <button
        class="w-full bg-primary-500 text-white font-black py-3 px-6 rounded-xl border-4 border-black shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
        @click="applyFilters"
      >
        Apply Filters
      </button>
      <button
        class="w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl border-4 border-black shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
        @click="clearFilters"
      >
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface FilterData {
  subject?: string;
  gradeLevel?: number;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMethod?: 'online' | 'offline';
  minRating?: number;
}

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
      subjects: [
        'Matematika',
        'Fisika',
        'Kimia',
        'Biologi',
        'Bahasa Indonesia',
        'Bahasa Inggris',
        'IPA',
        'IPS',
        'Ekonomi',
        'Geografi',
        'Sejarah',
        'PKN',
        'Informatika',
      ],
      provinces: [
        'DKI Jakarta',
        'Jawa Barat',
        'Jawa Tengah',
        'Jawa Timur',
        'Banten',
        'Yogyakarta',
        'Bali',
        'Sumatera Utara',
        'Sumatera Selatan',
        'Sulawesi Selatan',
      ],
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
    setMinRating(rating: number) {
      this.localFilters.minRating = rating;
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
