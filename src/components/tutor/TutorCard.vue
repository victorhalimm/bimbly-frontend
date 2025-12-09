<template>
  <div
    class="relative bg-white border-4 border-black rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl"
  >
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div class="relative">
          <img
            :src="tutor.profileImageUrl || defaultAvatar"
            :alt="tutor.fullName"
            class="w-20 h-20 rounded-full border-4 border-black object-cover"
          />
          <div
            v-if="tutor.averageRating >= 4.5"
            class="absolute -top-1 -right-1 bg-success-500 text-white p-1 rounded-full border-2 border-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div class="flex-1">
          <h3 class="text-xl font-black text-gray-900">{{ tutor.fullName }}</h3>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex items-center">
              <svg
                v-for="star in 5"
                :key="star"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                :class="star <= Math.round(tutor.averageRating) ? 'text-warning-500' : 'text-gray-300'"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="font-bold text-gray-700">{{ tutor.averageRating.toFixed(1) }}</span>
            <span class="text-gray-500">({{ tutor.totalReviews }} reviews)</span>
          </div>
          <p class="text-gray-600 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ tutor.city }}, {{ tutor.province }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="subject in tutor.subjects.slice(0, 3)"
            :key="subject"
            class="px-3 py-1 bg-primary-100 text-primary-700 font-bold text-sm rounded-full border-2 border-primary-500"
          >
            {{ subject }}
          </span>
          <span
            v-if="tutor.subjects.length > 3"
            class="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-sm rounded-full border-2 border-gray-400"
          >
            +{{ tutor.subjects.length - 3 }} more
          </span>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div>
          <span class="text-sm text-gray-500">Grade Levels</span>
          <p class="font-bold text-gray-900">{{ formattedGradeLevels }}</p>
        </div>
        <div class="text-right">
          <span class="text-sm text-gray-500">Hourly Rate</span>
          <p class="text-xl font-black text-primary-600">{{ formattedPrice }}</p>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <span
          v-for="method in tutor.teachingMethods"
          :key="method"
          class="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded border-2 border-gray-300"
        >
          <svg
            v-if="method === 'online'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.805A1 1 0 0112 18H8a1 1 0 01-.707-1.706l.804-.805L8.22 15H6a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          {{ method === 'online' ? 'Online' : 'Offline' }}
        </span>
      </div>

      <div class="mt-6">
        <button
          class="w-full bg-primary-500 text-white font-black py-3 px-6 rounded-xl border-4 border-black shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
          @click="handleViewProfile"
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export interface TutorData {
  id: string;
  userId: string;
  fullName: string;
  profileImageUrl: string | null;
  bio: string;
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: ('online' | 'offline')[];
  hourlyRate: number;
  city: string;
  province: string;
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  teachingExperienceYears: number;
}

export default defineComponent({
  name: 'TutorCard',
  props: {
    tutor: {
      type: Object as () => TutorData,
      required: true,
    },
  },
  emits: ['view-profile'],
  data() {
    return {
      defaultAvatar:
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(this.tutor.fullName) +
        '&background=3b82f6&color=fff&size=128',
    };
  },
  computed: {
    formattedGradeLevels(): string {
      const grades = [...this.tutor.gradeLevels].sort((a, b) => a - b);
      if (grades.length === 0) return 'N/A';
      if (grades.length === 1) return `Grade ${grades[0]}`;

      const ranges: string[] = [];
      let start = grades[0];
      let end = grades[0];

      for (let i = 1; i < grades.length; i++) {
        if (grades[i] === end + 1) {
          end = grades[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = grades[i];
          end = grades[i];
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);

      return `Grade ${ranges.join(', ')}`;
    },
    formattedPrice(): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.tutor.hourlyRate);
    },
  },
  methods: {
    handleViewProfile() {
      this.$emit('view-profile', this.tutor.id);
    },
  },
});
</script>
