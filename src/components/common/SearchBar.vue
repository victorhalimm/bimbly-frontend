<template>
  <div class="relative">
    <div class="bg-white rounded-full shadow-sm overflow-hidden">
      <div class="flex items-center">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder"
            class="w-full pl-8 pr-4 py-4.5 bg-transparent text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none"
            @input="handleInput"
            @focus="handleFocus"
            @keyup.enter="handleSearch"
            @keydown.escape="handleEscape"
          />
        </div>
        <button
          class="p-3 text-white rounded-full transition-colors flex items-center justify-center"
          @click="handleSearch"
        >
          <IconSearch class="text-blue-600 h-5 w-5" />
        </button>
      </div>
    </div>

    <div
      v-if="showRecommendations && searchQuery.trim().length"
      class="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] overflow-hidden"
    >
      <div v-if="filteredRecommendations.length > 0" class="p-1">
        <div class="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
          {{ getRecommendationTitle() }}
        </div>
        <div class="max-h-48 overflow-y-auto">
          <button
            v-for="recommendation in filteredRecommendations"
            :key="recommendation.value"
            class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left rounded-lg"
            @click="handleRecommendationClick(recommendation)"
          >
            <component
              :is="recommendation.icon"
              class="h-4 w-4 text-gray-400 flex-shrink-0"
            />
            <span class="text-gray-900 text-sm font-medium">{{ recommendation.label }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="searchQuery.trim()" class="p-3">
        <div class="py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg" @click="handleSearchByName">
          <p class="text-gray-900 text-lg font-medium mb-1">
            Search for tutor named "{{ searchQuery }}"
          </p>
          <p class="text-xs text-gray-500">
            No subjects or provinces found
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconSearch, IconMapPin, IconBook } from '@tabler/icons-vue';
import { SUBJECTS } from '@/config';
import type { SubjectConfig } from '@/config';
import type { Recommendation } from './types';

export default defineComponent({
  name: 'SearchBar',
  components: {
    IconSearch,
    IconMapPin,
    IconBook,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search for subjects or tutor name...',
    },
    provinces: {
      type: Array as () => Array<{ name: string; count?: number }>,
      default: () => [],
    },
  },
  emits: ['search', 'filter-subject', 'filter-province'],
  data() {
    return {
      searchQuery: '',
      showRecommendations: false,
      recommendations: [] as Recommendation[],
    };
  },
  computed: {
    filteredRecommendations(): Recommendation[] {
      if (!this.searchQuery.trim()) return [];

      const query = this.searchQuery.toLowerCase();
      return this.recommendations.filter(rec =>
        rec.label.toLowerCase().includes(query)
      ).slice(0, 3);
    },
  },
  mounted() {
    this.buildRecommendations();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    buildRecommendations() {
      const subjectRecs: Recommendation[] = SUBJECTS.map((subject: SubjectConfig) => ({
        label: subject.name,
        value: subject.name,
        type: 'subject' as const,
        icon: subject.icon,
      }));

      const provinceRecs: Recommendation[] = this.provinces.map(province => ({
        label: province.name,
        value: province.name,
        type: 'province' as const,
        icon: IconMapPin,
        count: province.count,
      }));

      this.recommendations = [...subjectRecs, ...provinceRecs];
    },
    handleInput() {
      this.showRecommendations = true;
    },
    handleFocus() {
      this.showRecommendations = true;
    },
    handleEscape() {
      this.showRecommendations = false;
    },
    handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!this.$el.contains(target)) {
        this.showRecommendations = false;
      }
    },
    getRecommendationTitle(): string {
      const hasSubjects = this.filteredRecommendations.some(rec => rec.type === 'subject');
      const hasProvinces = this.filteredRecommendations.some(rec => rec.type === 'province');

      if (hasSubjects && hasProvinces) {
        return 'Subjects & Provinces';
      } else if (hasSubjects) {
        return 'Subjects';
      } else if (hasProvinces) {
        return 'Provinces';
      }
      return 'Recommendations';
    },
    handleRecommendationClick(recommendation: Recommendation) {
      if (recommendation.type === 'subject') {
        this.$emit('filter-subject', recommendation.value);
      } else if (recommendation.type === 'province') {
        this.$emit('filter-province', recommendation.value);
      }
      this.showRecommendations = false;
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery.trim());
      }
      this.showRecommendations = false;
    },
    handleSearchByName() {
      this.$emit('search', this.searchQuery.trim());
      this.showRecommendations = false;
    },
    clearSearch() {
      this.searchQuery = '';
      this.showRecommendations = false;
    },
  },
  watch: {
    provinces: {
      handler() {
        this.buildRecommendations();
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
.max-h-64.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.max-h-64.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-64.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.max-h-64.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>