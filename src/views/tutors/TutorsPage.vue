<template>
  <div class="min-h-screen bg-white">
    <div class="bg-blue-100 py-16 pt-40 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Find Your
          <span class="relative inline-block px-1">
            <span class="relative z-20">Perfect</span>
            <svg class="absolute -bottom-2 left-0 w-full h-4 z-10" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
              <path d="M5,6 Q30,10 55,4 T95,8" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
            </svg>
          </span>
          Tutor
        </h1>
        <p class="text-xl text-gray-600 mb-8 font-medium max-w-xl">
          Hundreds of qualified tutors ready to help your learning journey
        </p>

        <div class="max-w-md bg-white rounded-full shadow-lg px-3 py-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tutors..."
                class="w-full pl-9 pr-2 py-2 bg-transparent text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none"
                @keyup.enter="goToSearch"
              />
            </div>
            <button
              class="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
              @click="goToSearch"
            >
              Search
            </button>
          </div>
        </div>

        <div class="max-w-4xl mt-6 bg-white rounded-full shadow-md px-2 py-3 overflow-hidden">
          <div class="relative">
            <button
              v-if="canScrollLeft"
              class="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-all"
              @click="scrollSubjects('left')"
            >
              <svg class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref="subjectsContainer"
              class="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-1"
              @scroll="handleScroll"
            >
              <button
                v-for="subject in subjectFilters"
                :key="subject.name"
                class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                :class="selectedSubject === subject.name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'"
                @click="selectSubjectAndSearch(subject.name)"
              >
                <component :is="subject.icon" size="18" stroke="2" :class="selectedSubject === subject.name ? 'text-white' : 'text-blue-600'" />
                <span class="text-sm font-medium whitespace-nowrap">{{ subject.label }}</span>
              </button>
            </div>

            <button
              v-if="canScrollRight"
              class="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-all"
              @click="scrollSubjects('right')"
            >
              <svg class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl rounded-t-[2rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h2 class="text-3xl font-black text-gray-900 mb-2">Our Top Tutors</h2>
        <p class="text-lg text-gray-600 font-medium">Selected based on ratings and experience</p>
      </div>

      <NeoAlert v-if="error" variant="error" :message="error" class="mb-6" />

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="bg-white rounded-[2.5rem] p-6 animate-pulse shadow-lg">
          <div class="flex flex-col items-center">
            <div class="w-32 h-32 bg-gray-200 rounded-3xl mb-4"></div>
            <div class="h-5 bg-gray-200 rounded-lg w-32 mb-2"></div>
            <div class="h-4 bg-gray-100 rounded-lg w-24 mb-4"></div>
            <div class="h-10 bg-gray-100 rounded-xl w-full"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TutorCard
          v-for="tutor in highlightedTutors"
          :key="tutor.id"
          :tutor="tutor"
          @view-profile="handleViewProfile"
        />
      </div>

      <div class="mt-10 text-center">
        <button
          class="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
          @click="$router.push('/tutors/search')"
        >
          View All Tutors
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>

    <div class="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8 mt-12">
      <div class="max-w-5xl mx-auto">
        <div class="bg-white rounded-[3rem] shadow-xl p-10 md:p-14 relative overflow-hidden border-2 border-blue-100">
          <div class="relative text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 transform rotate-12 hover:rotate-0 transition-transform">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Have Skills to Share?
            </h2>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
              Join hundreds of top tutors at Bimbly and start sharing your knowledge.
              Earn income while helping students achieve success!
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                class="group px-10 py-5 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
                @click="handleBecomeTutor"
              >
                <span class="flex items-center gap-2">
                  Become a Tutor
                  <svg class="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              <button
                class="px-8 py-4 bg-white text-gray-700 font-bold text-base rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:scale-105 transition-all"
                @click="$router.push('/about')"
              >
                Learn More
              </button>
            </div>

            <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">Flexible Income</h3>
                  <p class="text-sm text-gray-600">Set your own rates and teaching schedule</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">Trusted Platform</h3>
                  <p class="text-sm text-gray-600">Secure payment system and 24/7 support for tutors</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">Easy to Start</h3>
                  <p class="text-sm text-gray-600">Quick registration and transparent verification process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { NeoAlert } from '@/components/common/ui';
import TutorCard from '@/components/tutor/TutorCard.vue';
import TutorFilters from '@/components/tutor/TutorFilters.vue';
import type { FilterData } from '@/types/tutor';
import {
  IconLanguage,
  IconMath,
  IconBook,
  IconWorld,
  IconPiano,
  IconSwimming,
  IconRocket,
  IconFlask2,
  IconPlant,
  IconLetterA,
  IconAtom,
  IconVocabulary,
  IconCoin,
  IconArticle,
  IconDeviceDesktop,
  IconFriends
} from '@tabler/icons-vue';

export default defineComponent({
  name: 'TutorsPage',
  components: {
    NeoAlert,
    TutorCard,
    IconLanguage,
    IconMath,
    IconBook,
    IconWorld,
    IconPiano,
    IconSwimming,
    IconRocket,
    IconFlask2,
    IconPlant,
    IconLetterA,
    IconAtom,
    IconVocabulary,
    IconCoin,
    IconArticle,
    IconDeviceDesktop,
    IconFriends
  },
  data() {
    return {
      searchQuery: '',
      selectedSubject: null as string | null,
      subjectFilters: [
        { name: 'Matematika', label: 'Matematika', icon: 'IconMath' },
        { name: 'Fisika', label: 'Fisika', icon: 'IconRocket' },
        { name: 'Kimia', label: 'Kimia', icon: 'IconFlask2' },
        { name: 'Biologi', label: 'Biologi', icon: 'IconPlant' },
        { name: 'Bahasa Indonesia', label: 'Bahasa Indonesia', icon: 'IconLanguage' },
        { name: 'Bahasa Inggris', label: 'Bahasa Inggris', icon: 'IconLetterA' },
        { name: 'IPA', label: 'IPA', icon: 'IconAtom' },
        { name: 'IPS', label: 'IPS', icon: 'IconVocabulary' },
        { name: 'Ekonomi', label: 'Ekonomi', icon: 'IconCoin' },
        { name: 'Geografi', label: 'Geografi', icon: 'IconWorld' },
        { name: 'Sejarah', label: 'Sejarah', icon: 'IconArticle' },
        { name: 'PKN', label: 'PKN', icon: 'IconFriends' },
        { name: 'Informatika', label: 'Informatika', icon: 'IconDeviceDesktop' },
      ],
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  computed: {
    tutorStore() {
      return useTutorStore();
    },
    highlightedTutors() {
      return this.tutorStore.tutors.slice(0, 9);
    },
    loading() {
      return this.tutorStore.loading;
    },
    error() {
      return this.tutorStore.error;
    },
  },
  mounted() {
    this.tutorStore.searchTutors({ limit: 9, sortBy: 'rating', order: 'DESC' });
    this.$nextTick(() => {
      this.updateScrollButtons();
    });
  },
  methods: {
    goToSearch() {
      if (this.searchQuery) {
        this.$router.push(`/tutors/search?q=${encodeURIComponent(this.searchQuery)}`);
      } else {
        this.$router.push('/tutors/search');
      }
    },
    selectSubjectAndSearch(subjectName: string) {
      if (this.selectedSubject === subjectName) {
        this.selectedSubject = null;
        this.$router.push('/tutors/search');
      } else {
        this.selectedSubject = subjectName;
        this.$router.push(`/tutors/search?subject=${encodeURIComponent(subjectName)}`);
      }
    },
    handleViewProfile(tutorId: string) {
      this.$router.push(`/tutors/${tutorId}`);
    },
    handleBecomeTutor() {
      this.$router.push('/auth/register?type=tutor');
    },
    scrollSubjects(direction: 'left' | 'right') {
      const container = this.$refs.subjectsContainer as HTMLElement;
      if (!container) return;

      const scrollAmount = 300;
      const targetScroll = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    },
    handleScroll() {
      this.updateScrollButtons();
    },
    updateScrollButtons() {
      const container = this.$refs.subjectsContainer as HTMLElement;
      if (!container) return;

      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
    },
  },
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
