<template>
  <div
    class="group relative bg-white overflow-hidden cursor-pointer"
    @click="handleViewProfile"
  >

    <div class="relative h-72 overflow-hidden rounded-4xl">
      <img
        :src="tutor.profileImageUrl || defaultAvatar"
        :alt="tutor.fullName"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute rounded-b-4xl bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <h3 class="text-xl font-black text-white mb-1 break-words">{{ tutor.fullName }}</h3>
        <p class="text-sm text-white/90 font-medium break-words">
          {{ tutor.city }} ({{ teachingMethodLabel }})
        </p>
      </div>
    </div>

    <div class="py-6 px-2">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-base font-bold text-gray-900">{{ Number(tutor.averageRating).toFixed(1) }}</span>
            <span class="text-sm text-gray-500">({{ tutor.totalReviews }})</span>
          </div>
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
            {{ tutor.subjects[0] }}
          </span>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500">{{ formattedGradeLevels }}</p>
        </div>
      </div>

      <p v-if="tutor.bio" class="text-sm text-gray-600 mb-4 line-clamp-2 break-words">
        {{ tutor.bio }}
      </p>

      <div class="flex items-center justify-between">
        <div class="text-left">
          <p class="text-lg font-bold">{{ formattedPrice }}</p>
          <p class="text-xs text-gray-500">/hour</p>
        </div>
        <span
          v-if="tutor.subjects.length > 1"
          class="text-xs text-gray-500 font-medium"
        >
          +{{ tutor.subjects.length - 1 }} more subjects
        </span>
       
        
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
        '&background=93c5fd&color=fff',
    };
  },
  computed: {
    formattedGradeLevels(): string {
      const grades = [...this.tutor.gradeLevels].sort((a, b) => a - b);
      if (grades.length === 0) return 'All levels';
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
    teachingMethodLabel(): string {
      const methods = this.tutor.teachingMethods;
      if (methods.length === 2) return 'in-person & online';
      if (methods.includes('online')) return 'online';
      return 'in-person';
    }
  },
  methods: {
    handleViewProfile() {
      this.$emit('view-profile', this.tutor.id);
    },
    getSubjectStyle(subject: string): string {
      const styles: Record<string, string> = {
        'Matematika': 'bg-blue-100 text-blue-700',
        'Fisika': 'bg-purple-100 text-purple-700',
        'Kimia': 'bg-green-100 text-green-700',
        'Biologi': 'bg-emerald-100 text-emerald-700',
        'Bahasa Indonesia': 'bg-red-100 text-red-700',
        'Bahasa Inggris': 'bg-indigo-100 text-indigo-700',
        'IPA': 'bg-teal-100 text-teal-700',
        'IPS': 'bg-orange-100 text-orange-700',
        'Ekonomi': 'bg-yellow-100 text-yellow-700',
        'Geografi': 'bg-cyan-100 text-cyan-700',
        'Sejarah': 'bg-amber-100 text-amber-700',
        'PKN': 'bg-rose-100 text-rose-700',
        'Informatika': 'bg-violet-100 text-violet-700',
      };
      return styles[subject] || 'bg-gray-100 text-gray-700';
    },
    getPrimarySubjectStyle(subject: string): string {
      const styles: Record<string, string> = {
        'Matematika': 'bg-blue-600 text-white',
        'Fisika': 'bg-purple-600 text-white',
        'Kimia': 'bg-green-600 text-white',
        'Biologi': 'bg-emerald-600 text-white',
        'Bahasa Indonesia': 'bg-red-600 text-white',
        'Bahasa Inggris': 'bg-indigo-600 text-white',
        'IPA': 'bg-teal-600 text-white',
        'IPS': 'bg-orange-600 text-white',
        'Ekonomi': 'bg-yellow-600 text-white',
        'Geografi': 'bg-cyan-600 text-white',
        'Sejarah': 'bg-amber-600 text-white',
        'PKN': 'bg-rose-600 text-white',
        'Informatika': 'bg-violet-600 text-white',
      };
      return styles[subject] || 'bg-gray-600 text-white';
    },
  },
});
</script>
