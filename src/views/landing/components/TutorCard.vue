<template>
  <div class="group">
    <NeoCard variant="elevated" class="h-full">
      <!-- Avatar Section -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <img
            :src="tutor.avatar"
            :alt="tutor.name"
            class="w-24 h-24 border-4 border-black rounded-full object-cover"
          />
          <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-success border-2 border-black rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 1.414z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tutor Info -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-black text-gray-900 mb-2">
          {{ tutor.name }}
        </h3>
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <span
            v-for="subject in tutor.subjects"
            :key="subject"
            class="inline-block px-3 py-1 border-2 border-black text-sm font-bold rounded"
            style="background-color: var(--color-primary-100); color: var(--color-primary-800);"
          >
            {{ subject }}
          </span>
        </div>

        <!-- Rating -->
        <div class="flex items-center justify-center mb-4">
          <div class="flex">
            <svg
              v-for="star in 5"
              :key="star"
              class="w-5 h-5"
              :class="star <= Math.round(tutor.rating) ? 'text-yellow-400' : 'text-gray-300'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <span class="ml-2 text-lg font-black text-gray-900">
            {{ tutor.rating }}
          </span>
          <span class="ml-2 text-sm text-gray-600">
            ({{ tutor.reviewCount }} reviews)
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="text-center">
          <div class="text-2xl font-black text-gray-900">50+</div>
          <div class="text-sm text-gray-600 font-medium">Students</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-gray-900">500+</div>
          <div class="text-sm text-gray-600 font-medium">Sessions</div>
        </div>
      </div>

      <!-- CTA Button -->
      <NeoButton variant="primary" full-width @click="handleViewProfile">
        View Profile
      </NeoButton>
    </NeoCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoCard, NeoButton } from '../../../components/common/ui';

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  avatar: string;
}

export default defineComponent({
  name: 'TutorCard',
  components: {
    NeoCard,
    NeoButton,
  },
  props: {
    tutor: {
      type: Object as () => Tutor,
      required: true,
    },
  },
  methods: {
    handleViewProfile() {
      this.$emit('view-profile', this.tutor);
    },
  },
  emits: ['view-profile'],
});
</script>