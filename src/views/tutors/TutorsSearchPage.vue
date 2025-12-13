<template>
  <div class="min-h-screen bg-white">
    <div class="bg-blue-50 py-12 px-4 pt-40 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 text-center mb-8">
          Find Your Perfect Tutor
        </h1>

        <div class="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-lg p-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for subjects or tutor name..."
                class="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-200 rounded-[1.5rem] text-gray-900 placeholder-gray-400 text-base font-medium focus:outline-none transition-all"
                @keyup.enter="handleSearch"
              />
            </div>
            <button
              class="px-8 py-4 bg-blue-600 text-white font-bold text-base rounded-[1.5rem] hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
              @click="handleSearch"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <div class="relative" ref="subjectFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'subject' || filters.subject
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('subject')"
          >
            <span>{{ filters.subject || 'Subject' }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'subject' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'subject'"
            class="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="subject in subjects"
                :key="subject"
                class="px-3 py-1.5 text-sm rounded-full transition-all font-medium"
                :class="filters.subject === subject
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                @click="selectSubject(subject)"
              >
                {{ subject }}
              </button>
            </div>
          </div>
        </div>

        <div class="relative" ref="gradeFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'grade' || filters.gradeLevel
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('grade')"
          >
            <span>{{ filters.gradeLevel ? `Grade ${filters.gradeLevel}` : 'Grade Level' }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'grade' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'grade'"
            class="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="grade in 12"
                :key="grade"
                class="py-2 text-sm rounded-xl transition-all font-medium"
                :class="filters.gradeLevel === grade
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                @click="selectGrade(grade)"
              >
                {{ grade }}
              </button>
            </div>
          </div>
        </div>

        <div class="relative" ref="locationFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'location' || filters.city || (filters.province && filters.province !== '')
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('location')"
          >
            <span>{{ filters.city || (filters.province && filters.province !== '' ? filters.province : 'Location') }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'location' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'location'"
            class="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="space-y-3">
              <input
                v-model="filters.city"
                type="text"
                placeholder="City"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                @input="handleSearch"
              />
              <select
                v-model="filters.province"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                @change="handleSearch"
              >
                <option value="">All Provinces</option>
                <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="relative" ref="priceFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'price' || filters.minPrice || filters.maxPrice
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('price')"
          >
            <span>{{ priceLabel }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'price' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'price'"
            class="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="flex items-center gap-2">
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  min="0"
                  class="w-full pl-9 pr-2 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  @input="handleSearch"
                />
              </div>
              <span class="text-gray-300">—</span>
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  min="0"
                  class="w-full pl-9 pr-2 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  @input="handleSearch"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="relative" ref="methodFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'method' || filters.teachingMethod
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('method')"
          >
            <span>{{ methodLabel }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'method' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'method'"
            class="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="space-y-2">
              <button
                class="w-full py-2.5 text-sm rounded-xl transition-all font-medium text-left px-4"
                :class="!filters.teachingMethod ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                @click="selectMethod(undefined)"
              >
                All Methods
              </button>
              <button
                class="w-full py-2.5 text-sm rounded-xl transition-all font-medium text-left px-4 flex items-center gap-2"
                :class="filters.teachingMethod === 'online' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                @click="selectMethod('online')"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Online
              </button>
              <button
                class="w-full py-2.5 text-sm rounded-xl transition-all font-medium text-left px-4 flex items-center gap-2"
                :class="filters.teachingMethod === 'offline' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                @click="selectMethod('offline')"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                In-Person
              </button>
            </div>
          </div>
        </div>

        <div class="relative" ref="ratingFilter">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-full font-medium transition-all text-sm"
            :class="openFilter === 'rating' || filters.minRating
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'"
            @click="toggleFilter('rating')"
          >
            <span>{{ filters.minRating ? `${filters.minRating}+ Stars` : 'Rating' }}</span>
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openFilter === 'rating' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="openFilter === 'rating'"
            class="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div class="flex items-center justify-center gap-1">
              <button
                v-for="rating in 5"
                :key="rating"
                class="p-1.5 rounded-lg transition-all"
                :class="filters.minRating === rating ? 'bg-yellow-50' : 'hover:bg-gray-50'"
                @click="selectRating(rating)"
              >
                <svg
                  class="h-7 w-7 transition-colors"
                  :class="rating <= (filters.minRating || 0) ? 'text-yellow-400' : 'text-gray-200'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </button>
            </div>
            <button
              v-if="filters.minRating"
              class="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
              @click="selectRating(undefined)"
            >
              Clear
            </button>
          </div>
        </div>

        <button
          v-if="hasActiveFilters"
          class="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
          @click="clearAllFilters"
        >
          Clear all
        </button>

        <div class="ml-auto flex items-baseline gap-2">
          <h2 class="text-2xl font-black text-gray-900">
            {{ loading ? 'Searching' : totalResults }}
          </h2>
          <span v-if="!loading" class="text-lg text-gray-500 font-medium">tutors</span>
          <div v-if="loading" class="flex gap-1 items-end pb-1">
            <span class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100"></span>
            <span class="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-4xl p-6 animate-pulse shadow-lg">
          <div class="flex flex-col items-center">
            <div class="w-full h-48 bg-gray-200 rounded-3xl mb-4"></div>
            <div class="h-5 bg-gray-200 rounded-lg w-32 mb-2"></div>
            <div class="h-4 bg-gray-100 rounded-lg w-24 mb-4"></div>
            <div class="h-10 bg-gray-100 rounded-xl w-full"></div>
          </div>
        </div>
      </div>

      <div v-else-if="tutors.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-3xl mb-6">
          <svg class="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No tutors found</h3>
        <p class="text-gray-500 mb-6 max-w-sm mx-auto">
          We couldn't find any tutors matching your criteria. Try adjusting your filters.
        </p>
        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
          @click="clearAllFilters"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TutorCard
          v-for="tutor in tutors"
          :key="tutor.id"
          :tutor="tutor"
          @view-profile="handleViewProfile"
        />
      </div>

      <div v-if="totalPages > 1 && !loading" class="mt-10 flex items-center justify-center gap-1">
        <button
          :disabled="currentPage === 1"
          class="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="goToPage(currentPage - 1)"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex items-center gap-1 px-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="min-w-[40px] h-10 rounded-xl font-medium transition-all"
            :class="
              page === currentPage
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage === totalPages"
          class="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="goToPage(currentPage + 1)"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { useToast } from '@/composables/useToast';
import TutorCard from '@/components/tutor/TutorCard.vue';
import Navbar from '@/components/common/layout/Navbar.vue';
import type { FilterData } from '@/types/filters';

export default defineComponent({
  name: 'TutorsSearchPage',
  components: {
    TutorCard,
    Navbar
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      searchQuery: '',
      filters: { province: '' } as FilterData,
      openFilter: null as string | null,
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
  computed: {
    tutorStore() {
      return useTutorStore();
    },
    tutors() {
      return this.tutorStore.tutors;
    },
    loading() {
      return this.tutorStore.loading;
    },
    error() {
      return this.tutorStore.error;
    },
    currentPage() {
      return this.tutorStore.currentPage;
    },
    totalPages() {
      return this.tutorStore.totalPages;
    },
    totalResults() {
      return this.tutorStore.totalResults;
    },
    visiblePages(): number[] {
      const pages: number[] = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
    hasActiveFilters(): boolean {
      return !!(
        this.filters.subject ||
        this.filters.gradeLevel ||
        this.filters.city ||
        (this.filters.province && this.filters.province !== '') ||
        this.filters.minPrice ||
        this.filters.maxPrice ||
        this.filters.teachingMethod ||
        this.filters.minRating
      );
    },
    priceLabel(): string {
      if (this.filters.minPrice && this.filters.maxPrice) {
        return `Rp ${this.formatPrice(this.filters.minPrice)} - ${this.formatPrice(this.filters.maxPrice)}`;
      }
      if (this.filters.minPrice) {
        return `Min Rp ${this.formatPrice(this.filters.minPrice)}`;
      }
      if (this.filters.maxPrice) {
        return `Max Rp ${this.formatPrice(this.filters.maxPrice)}`;
      }
      return 'Price Range';
    },
    methodLabel(): string {
      if (this.filters.teachingMethod === 'online') return 'Online';
      if (this.filters.teachingMethod === 'offline') return 'In-Person';
      return 'Teaching Method';
    },
  },
  watch: {
    error(newError: string | null) {
      if (newError) {
        this.toast.error('Search Error', newError);
      }
    },
  },
  mounted() {
    const query = this.$route.query.q as string;
    const subject = this.$route.query.subject as string;

    if (subject) {
      this.filters.subject = subject;
    }

    if (query) {
      this.searchQuery = query;
    }

    this.handleSearch();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    formatPrice(price: number): string {
      if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1)}M`;
      }
      if (price >= 1000) {
        return `${(price / 1000).toFixed(0)}K`;
      }
      return price.toString();
    },
    toggleFilter(filterName: string) {
      this.openFilter = this.openFilter === filterName ? null : filterName;
    },
    handleClickOutside(event: MouseEvent) {
      const refs = ['subjectFilter', 'gradeFilter', 'locationFilter', 'priceFilter', 'methodFilter', 'ratingFilter'];
      const clickedInside = refs.some((refName) => {
        const el = this.$refs[refName] as HTMLElement;
        return el && el.contains(event.target as Node);
      });

      if (!clickedInside) {
        this.openFilter = null;
      }
    },
    selectSubject(subject: string) {
      if (this.filters.subject === subject) {
        this.filters.subject = undefined;
      } else {
        this.filters.subject = subject;
      }
      this.openFilter = null;
      this.handleSearch();
    },
    selectGrade(grade: number) {
      if (this.filters.gradeLevel === grade) {
        this.filters.gradeLevel = undefined;
      } else {
        this.filters.gradeLevel = grade;
      }
      this.openFilter = null;
      this.handleSearch();
    },
    selectMethod(method: 'online' | 'offline' | undefined) {
      this.filters.teachingMethod = method;
      this.openFilter = null;
      this.handleSearch();
    },
    selectRating(rating: number | undefined) {
      if (this.filters.minRating === rating) {
        this.filters.minRating = undefined;
      } else {
        this.filters.minRating = rating;
      }
      this.handleSearch();
    },
    handleSearch() {
      const searchFilters: Record<string, unknown> = {
        ...this.filters,
        page: 1,
      };

      if (this.searchQuery) {
        searchFilters.name = this.searchQuery;
      }

      this.tutorStore.searchTutors(searchFilters);
    },
    goToPage(page: number) {
      this.tutorStore.setPage(page);
    },
    handleViewProfile(tutorId: string) {
      this.$router.push(`/tutors/${tutorId}`);
    },
    clearAllFilters() {
      this.searchQuery = '';
      this.filters = { province: '' };
      this.openFilter = null;
      this.tutorStore.resetFilters();
      this.tutorStore.searchTutors();
    },
  },
});
</script>

<style scoped>
.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}
</style>
