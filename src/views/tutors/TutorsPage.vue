<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-primary border-b-4 border-black py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4">
          Find Your Perfect Tutor
        </h1>
        <p class="text-xl text-white font-medium mb-8">
          Connect with expert tutors for every subject
        </p>
        <NeoButton variant="secondary" size="lg" @click="$router.push('/register')">
          Get Started Today
        </NeoButton>
      </div>
    </section>

    <!-- Tutors Grid -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TutorCard
            v-for="tutor in allTutors"
            :key="tutor.id"
            :tutor="tutor"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoButton } from '../../components/common/ui';
import TutorCard from '../landing/components/TutorCard.vue';

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  avatar: string;
}

export default defineComponent({
  name: 'TutorsPage',
  components: {
    NeoButton,
    TutorCard,
  },
  data() {
    return {
      allTutors: [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          subjects: ['Mathematics', 'Physics'],
          rating: 4.9,
          reviewCount: 127,
          avatar: '/api/placeholder/80/80',
        },
        {
          id: '2',
          name: 'Prof. Michael Chen',
          subjects: ['Chemistry', 'Biology'],
          rating: 4.8,
          reviewCount: 95,
          avatar: '/api/placeholder/80/80',
        },
        {
          id: '3',
          name: 'Ms. Lisa Anderson',
          subjects: ['English', 'Literature'],
          rating: 4.9,
          reviewCount: 156,
          avatar: '/api/placeholder/80/80',
        },
        {
          id: '4',
          name: 'Dr. James Wilson',
          subjects: ['Mathematics', 'Statistics'],
          rating: 4.7,
          reviewCount: 89,
          avatar: '/api/placeholder/80/80',
        },
        {
          id: '5',
          name: 'Mrs. Emily Rodriguez',
          subjects: ['History', 'Geography'],
          rating: 4.8,
          reviewCount: 112,
          avatar: '/api/placeholder/80/80',
        },
        {
          id: '6',
          name: 'Mr. David Kim',
          subjects: ['Computer Science', 'Programming'],
          rating: 4.9,
          reviewCount: 203,
          avatar: '/api/placeholder/80/80',
        },
      ] as Tutor[],
    };
  },
});
</script>