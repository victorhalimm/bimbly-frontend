<template>
  <div class="min-h-screen bg-white">
    <div class="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 py-24 pt-44 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-20 right-20 w-48 h-48 bg-blue-200 rounded-full opacity-40 blur-3xl animate-blob"></div>
      <div class="absolute bottom-32 left-10 w-64 h-64 bg-yellow-200 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>

      <div class="absolute top-1/4 left-16 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
      <div class="absolute bottom-1/3 right-24 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute top-1/2 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1500"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-5xl text-center md:text-6xl mx-auto font-black text-gray-900 mb-4">
          Find Your
          <span class="relative inline-block px-1">
            <span class="relative z-20">Perfect</span>
            <svg class="absolute -bottom-2 left-0 w-full h-4 z-10" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
            </svg>
          </span>
          Tutor
        </h1>
        <p class="text-xl text-center text-gray-600 mb-8 font-medium max-w-xl mx-auto">
          Hundreds of qualified tutors ready to help your learning journey
        </p>

        <div class="w-full max-w-md mx-auto">
          <SearchBar
            placeholder="Search tutors..."
            :provinces="provincesWithCount"
            @search="handleSearch"
            @filter-subject="handleSubjectFilter"
            @filter-province="handleProvinceFilter"
          />
        </div>

        <div class="max-w-4xl mx-auto mt-6 bg-white rounded-full shadow-md px-2 py-3 overflow-hidden">
          <div class="relative">
            <button
              v-if="canScrollLeft"
              class="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-all cursor-pointer"
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
                class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer"
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
              class="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-all cursor-pointer"
              @click="scrollSubjects('right')"
            >
              <svg class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-16">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" fill="white" class="w-full h-full">
          <path d="M0,0 C150,50 350,50 600,25 C850,0 1050,0 1200,25 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h2 class="text-3xl font-black text-gray-900 mb-2">Our Top Tutors</h2>
        <p class="text-lg text-gray-600 font-medium">Selected based on ratings and experience</p>
      </div>

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

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <TutorCard
          v-for="tutor in highlightedTutors"
          :key="tutor.id"
          :tutor="tutor"
          @view-profile="handleViewProfile"
        />
      </div>

      <div class="mt-10 text-center">
        <button
          class="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg cursor-pointer"
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
                class="group px-10 py-5 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg cursor-pointer"
                @click="handleBecomeTutor"
              >
                <span class="flex items-center gap-2">
                  Become a Tutor
                  <svg class="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
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
import { useToast } from '@/composables/useToast';
import TutorCard from '@/components/tutor/TutorCard.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import { SUBJECTS, PROVINCE_NAMES } from '@/config';
import {
  IconLanguage,
  IconMath,
  IconBook,
  IconWorld,
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
    TutorCard,
    SearchBar,
    IconLanguage,
    IconMath,
    IconBook,
    IconWorld,
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
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return { 
      searchQuery: '',
      selectedSubject: null as string | null,
      subjectFilters: SUBJECTS.map(s => ({
        name: s.name,
        label: s.label,
        icon: s.iconName,
      })),
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
    provincesWithCount() {
      return PROVINCE_NAMES.map(name => ({
        name
      }));
    },
  },
  watch: {
    error(newError: string | null) {
      if (newError) {
        this.toast.error('Error', newError);
      }
    },
  },
  mounted() {
    this.tutorStore.resetFilters();
    this.tutorStore.searchTutors({ limit: 9, sortBy: 'rating', order: 'DESC' });
    this.$nextTick(() => {
      this.updateScrollButtons();
    });
  },
  methods: {
    handleSearch(query: string) {
      if (query) {
        this.$router.push(`/tutors/search?q=${encodeURIComponent(query)}`);
      } else {
        this.$router.push('/tutors/search');
      }
    },
    handleSubjectFilter(subject: string) {
      this.$router.push(`/tutors/search?subject=${encodeURIComponent(subject)}`);
    },
    handleProvinceFilter(province: string) {
      this.$router.push(`/tutors/search?province=${encodeURIComponent(province)}`);
    },
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

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.03);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.97);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.01);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
