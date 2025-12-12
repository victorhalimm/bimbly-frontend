<template>
  <div class="min-h-screen bg-gray-50">
    <section class="bg-primary border-b-4 border-black py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4">Find Your Perfect Tutor</h1>
        <p class="text-xl text-white font-medium mb-8">
          Search from our qualified tutors by subject, grade, location, and more
        </p>
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchName"
              type="text"
              placeholder="Search by tutor name..."
              class="w-full px-6 py-4 pr-14 border-4 border-black rounded-2xl font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              @keyup.enter="handleSearch"
            />
            <button
              class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-xl border-2 border-black hover:bg-primary-700 transition-colors"
              @click="handleSearch"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <aside class="w-full lg:w-80 flex-shrink-0">
            <div class="lg:sticky lg:top-8">
              <button
                class="lg:hidden w-full bg-white border-4 border-black rounded-xl p-4 font-bold mb-4 flex items-center justify-between"
                @click="showFilters = !showFilters"
              >
                <span>Filters</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 transition-transform"
                  :class="{ 'rotate-180': showFilters }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div :class="{ hidden: !showFilters }" class="lg:block">
                <TutorFilters v-model="filters" @apply="handleApplyFilters" />
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 class="text-2xl font-black text-gray-900">
                  {{ loading ? 'Searching...' : `${totalResults} Tutors Found` }}
                </h2>
                <p class="text-gray-600">
                  Page {{ currentPage }} of {{ totalPages || 1 }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <label class="font-bold text-gray-700">Sort by:</label>
                <select
                  v-model="sortBy"
                  class="px-4 py-2 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
                  @change="handleSortChange"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="price-desc">Highest Price</option>
                  <option value="experience">Most Experienced</option>
                  <option value="sessions">Most Sessions</option>
                </select>
              </div>
            </div>

            <NeoAlert v-if="error" variant="error" :message="error" class="mb-6" />

            <div v-if="loading" class="flex justify-center py-20">
              <div
                class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>

            <div v-else-if="tutors.length === 0" class="text-center py-20">
              <div
                class="bg-white border-4 border-black rounded-2xl shadow-2xl p-12 max-w-md mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-xl font-black text-gray-900 mb-2">No Tutors Found</h3>
                <p class="text-gray-600 mb-6">
                  No tutors match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  class="bg-primary-500 text-white font-bold py-2 px-6 rounded-xl border-4 border-black hover:-translate-y-1 transition-transform"
                  @click="clearAllFilters"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <TutorCard
                v-for="tutor in tutors"
                :key="tutor.id"
                :tutor="tutor"
                @view-profile="handleViewProfile"
              />
            </div>

            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <div class="flex items-center gap-2">
                <button
                  :disabled="currentPage === 1"
                  class="px-4 py-2 bg-white border-4 border-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-transform"
                  @click="goToPage(currentPage - 1)"
                >
                  Previous
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="w-12 h-12 border-4 border-black rounded-xl font-black transition-all"
                  :class="
                    page === currentPage
                      ? 'bg-primary-500 text-white'
                      : 'bg-white hover:-translate-y-1'
                  "
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>

                <button
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 bg-white border-4 border-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-transform"
                  @click="goToPage(currentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { NeoAlert } from '@/components/common/ui';
import TutorCard from '@/components/tutor/TutorCard.vue';
import TutorFilters from '@/components/tutor/TutorFilters.vue';
import type { FilterData } from '@/types/tutor';

export default defineComponent({
  name: 'TutorsPage',
  components: {
    NeoAlert,
    TutorCard,
    TutorFilters,
  },
  data() {
    return {
      searchName: '',
      filters: {} as FilterData,
      sortBy: 'rating',
      showFilters: true,
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
  },
  mounted() {
    this.tutorStore.searchTutors();
  },
  methods: {
    handleSearch() {
      const searchFilters: Record<string, unknown> = {
        ...this.filters,
        page: 1,
      };

      if (this.searchName) {
        searchFilters.name = this.searchName;
      }

      this.tutorStore.searchTutors(searchFilters);
    },
    handleApplyFilters() {
      this.handleSearch();
    },
    handleSortChange() {
      let sortBy = 'rating';
      let order: 'ASC' | 'DESC' = 'DESC';

      if (this.sortBy === 'price-asc') {
        sortBy = 'price';
        order = 'ASC';
      } else if (this.sortBy === 'price-desc') {
        sortBy = 'price';
        order = 'DESC';
      } else if (this.sortBy === 'experience') {
        sortBy = 'experience';
        order = 'DESC';
      } else if (this.sortBy === 'sessions') {
        sortBy = 'sessions';
        order = 'DESC';
      }

      this.tutorStore.searchTutors({
        ...this.filters,
        sortBy: sortBy as 'rating' | 'price' | 'experience' | 'sessions',
        order,
        page: 1,
      });
    },
    goToPage(page: number) {
      this.tutorStore.setPage(page);
    },
    handleViewProfile(tutorId: string) {
      this.$router.push(`/tutors/${tutorId}`);
    },
    clearAllFilters() {
      this.searchName = '';
      this.filters = {};
      this.sortBy = 'rating';
      this.tutorStore.resetFilters();
      this.tutorStore.searchTutors();
    },
  },
});
</script>
