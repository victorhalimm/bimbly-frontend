<template>
  <div class="min-h-screen bg-gray-50">
    <div class="relative bg-blue-100 pt-28 pb-16 px-4">
      <div class="max-w-6xl mx-auto">
        <button @click="goBack"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors hover:cursor-pointer">
          <IconArrowLeft size="20" stroke="2" />
          <span class="font-medium">Back to Profile</span>
        </button>

        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          Ratings &
          <span class="relative inline-block px-1">
            <span class="relative z-20">Reviews</span>
            <svg class="absolute -bottom-1 left-0 w-full h-3 z-10" viewBox="0 0 100 12" preserveAspectRatio="none"
              fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4" />
              <path d="M5,6 Q30,10 55,4 T95,8" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" opacity="0.3" />
            </svg>
          </span>
        </h1>

        <div class="flex items-baseline gap-3 mt-6">
          <span class="text-6xl font-black text-gray-900">{{ formattedRating }}</span>
          <IconStarFilled size="32" class="text-yellow-400" />
          <span class="text-gray-500 text-lg ml-2">
            ({{ totalReviews }} {{ totalReviews === 1 ? 'review' : 'reviews' }})
          </span>
        </div>

      </div>

      <svg class="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
        <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#f9fafb" />
      </svg>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <div v-if="loading && !reviews.length" class="flex justify-center py-16">
        <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-64 flex-shrink-0">
            <div class="sticky top-24">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Rating Breakdown</h3>
              <div class="space-y-2">
                <div v-for="dist in ratingDistribution" :key="dist.star" class="flex items-center gap-2">
                  <div class="flex items-center gap-1 w-8">
                    <span class="text-sm text-gray-600">{{ dist.star }}</span>
                    <IconStarFilled size="12" class="text-gray-400" />
                  </div>
                  <div class="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" :class="getBarColor(dist.star)"
                      :style="{ width: getDistributionWidth(dist.count) }"></div>
                  </div>
                  <span class="w-10 text-xs text-gray-400 text-right">({{ formatCount(dist.count) }})</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">
                Showing {{ showingStart }}-{{ showingEnd }} of {{ totalReviews }}
              </h2>
              <div class="relative">
                <button @click="toggleDropdown"
                  class="inline-flex items-center gap-2 bg-white rounded-full shadow-sm pl-4 pr-3 py-2 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                  <IconArrowsSort size="18" stroke="2" class="text-blue-600" />
                  <span class="text-sm font-medium text-gray-700">{{ currentSortLabel }}</span>
                  <IconChevronDown size="16" stroke="2" class="text-gray-400 transition-transform"
                    :class="{ 'rotate-180': isDropdownOpen }" />
                </button>
                <div v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <button v-for="option in sortOptions" :key="option.value" @click="selectSort(option.value)"
                    class="w-full px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer" :class="sortBy === option.value
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'">
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="reviews.length === 0" class="bg-white rounded-3xl p-12 shadow-lg text-center">
              <IconMessageCircle size="48" stroke="1.5" class="mx-auto text-gray-300 mb-4" />
              <h3 class="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
              <p class="text-gray-500">This tutor hasn't received any reviews yet.</p>
            </div>

            <div v-else class="space-y-4">
              <ReviewCard v-for="(review, index) in reviews" :key="index" :review="review" />

              <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-1">
                <button :disabled="currentPage === 1"
                  class="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  @click="goToPage(currentPage - 1)">
                  <IconChevronLeft size="20" stroke="2" />
                </button>

                <div class="flex items-center gap-1 px-2">
                  <button v-for="page in visiblePages" :key="page"
                    class="min-w-[40px] h-10 rounded-xl font-medium transition-all hover:cursor-pointer" :class="page === currentPage
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </div>

                <button :disabled="currentPage === totalPages"
                  class="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  @click="goToPage(currentPage + 1)">
                  <IconChevronRight size="20" stroke="2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconArrowLeft, IconMessageCircle, IconStarFilled, IconArrowsSort, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import ReviewCard from '../../components/reviews/ReviewCard.vue';
import { useReviewsStore } from '../../stores/reviews.store';
import type { SortBy } from '../../services/reviews.service';

const REVIEWS_PER_PAGE = 10;

export default defineComponent({
  name: 'TutorReviews',
  components: {
    IconArrowLeft,
    IconMessageCircle,
    IconStarFilled,
    IconArrowsSort,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    ReviewCard,
  },
  data() {
    return {
      sortBy: 'newest' as SortBy,
      currentPage: 1,
      isDropdownOpen: false,
      sortOptions: [
        { value: 'newest' as SortBy, label: 'Newest' },
        { value: 'oldest' as SortBy, label: 'Oldest' },
        { value: 'highest' as SortBy, label: 'Highest Rated' },
        { value: 'lowest' as SortBy, label: 'Lowest Rated' },
      ],
    };
  },
  computed: {
    tutorId(): string {
      return this.$route.params.id as string;
    },
    reviewsStore() {
      return useReviewsStore();
    },
    reviews() {
      return this.reviewsStore.reviews;
    },
    loading() {
      return this.reviewsStore.loading;
    },
    averageRating(): number {
      const rating = this.reviewsStore.averageRating;
      return typeof rating === 'number' ? rating : 0;
    },
    formattedRating(): string {
      return Number(this.averageRating).toFixed(1);
    },
    totalReviews(): number {
      return this.reviewsStore.totalReviews || 0;
    },
    ratingDistribution() {
      return this.reviewsStore.ratingDistribution;
    },
    hasNextPage() {
      return this.reviewsStore.hasNextPage;
    },
    hasPrevPage() {
      return this.reviewsStore.hasPrevPage;
    },
    totalPages() {
      return this.reviewsStore.totalPages;
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
    showingStart(): number {
      if (this.totalReviews === 0) return 0;
      return (this.currentPage - 1) * REVIEWS_PER_PAGE + 1;
    },
    showingEnd(): number {
      return Math.min(this.currentPage * REVIEWS_PER_PAGE, this.totalReviews);
    },
    currentSortLabel(): string {
      const option = this.sortOptions.find((o) => o.value === this.sortBy);
      return option?.label || 'Newest';
    },
  },
  methods: {
    async fetchReviews(page: number = 1) {
      try {
        await this.reviewsStore.fetchByTutor(this.tutorId, page, REVIEWS_PER_PAGE, this.sortBy);
        this.currentPage = page;
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async selectSort(value: SortBy) {
      this.sortBy = value;
      this.isDropdownOpen = false;
      this.currentPage = 1;
      await this.fetchReviews(1);
    },
    handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.isDropdownOpen = false;
      }
    },
    async goToPage(page: number) {
      if (page < 1 || page > this.totalPages) return;
      await this.fetchReviews(page);
    },
    getDistributionWidth(count: number): string {
      if (this.totalReviews === 0) return '0%';
      return `${(count / this.totalReviews) * 100}%`;
    },
    getBarColor(star: number): string {
      const colors: Record<number, string> = {
        5: 'bg-green-500',
        4: 'bg-green-400',
        3: 'bg-yellow-400',
        2: 'bg-orange-400',
        1: 'bg-red-400',
      };
      return colors[star] || 'bg-gray-400';
    },
    formatCount(count: number): string {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    },
    goBack() {
      this.$router.push({ name: 'TutorProfilePublic', params: { id: this.tutorId } });
    },
  },
  mounted() {
    this.reviewsStore.clearReviews();
    this.fetchReviews();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    this.reviewsStore.clearReviews();
    document.removeEventListener('click', this.handleClickOutside);
  },
});
</script>

<style scoped></style>
