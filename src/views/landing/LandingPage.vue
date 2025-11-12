<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <HeroSection @get-started="handleGetStarted" @become-tutor="handleBecomeTutor" />

    <!-- Value Proposition Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">
            Why Students Choose Bimbly
          </h2>
          <div class="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NeoCard class="group hover:translate-y-[-8px] transition-all duration-300">
            <div class="w-16 h-16 bg-primary border-4 border-black rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Expert Tutors
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              Qualified educators with proven teaching experience
            </p>
          </NeoCard>

          <NeoCard class="group hover:translate-y-[-8px] transition-all duration-300">
            <div class="w-16 h-16 bg-success border-4 border-black rounded-lg flex items-center justify-center mb-6 group-hover:bg-success">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Fast Results
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              See improvement in grades and confidence quickly
            </p>
          </NeoCard>

          <NeoCard class="group hover:translate-y-[-8px] transition-all duration-300">
            <div class="w-16 h-16 bg-warning border-4 border-black rounded-lg flex items-center justify-center mb-6 group-hover:bg-warning">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Affordable
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              Quality education at prices families can afford
            </p>
          </NeoCard>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">
            How Bimbly Works
          </h2>
          <div class="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: var(--color-primary-100);">
              <span class="text-3xl font-black text-primary">1</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Search Tutors
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              Find qualified tutors for any subject
            </p>
            <div class="mt-8 hidden md:block">
              <div class="w-px h-16 bg-black mx-auto"></div>
            </div>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: var(--color-success);">
              <span class="text-3xl font-black text-white">2</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Book Session
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              Schedule sessions at your convenience
            </p>
            <div class="mt-8 hidden md:block">
              <div class="w-px h-16 bg-black mx-auto"></div>
            </div>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: var(--color-warning-100);">
              <span class="text-3xl font-black text-warning">3</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3">
              Start Learning
            </h3>
            <p class="text-lg text-gray-600 font-medium">
              Connect and begin your learning journey
            </p>
            <div class="mt-8 hidden md:block">
              <div class="w-px h-16 bg-black mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Tutors Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">
            Meet Our Top Tutors
          </h2>
          <div class="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TutorCard
            v-for="tutor in featuredTutors"
            :key="tutor.id"
            :tutor="tutor"
          />
        </div>

        <div class="text-center mt-12">
          <NeoButton variant="secondary" size="lg" @click="handleViewAllTutors">
            View All Tutors
          </NeoButton>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-4xl font-black text-gray-900 mb-6">
              Smart Learning Platform
            </h2>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary border-2 border-black rounded flex-shrink-0 mt-1"></div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Progress Tracking
                  </h3>
                  <p class="text-lg text-gray-600 font-medium">
                    Monitor your learning journey with detailed analytics
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-success border-2 border-black rounded flex-shrink-0 mt-1"></div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Flexible Scheduling
                  </h3>
                  <p class="text-lg text-gray-600 font-medium">
                    Book sessions that fit your busy schedule
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-warning border-2 border-black rounded flex-shrink-0 mt-1"></div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Safe & Secure
                  </h3>
                  <p class="text-lg text-gray-600 font-medium">
                    Verified tutors and secure payment system
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="w-full h-96 bg-gray-200 border-4 border-black rounded-lg"></div>
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary border-4 border-black rounded-lg"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-success border-4 border-black rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-black text-white mb-6">
          Ready to Start Learning?
        </h2>
        <p class="text-xl text-gray-300 mb-8 font-medium">
          Join thousands of students already improving their grades
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NeoButton variant="primary" size="lg" @click="handleGetStarted">
            Get Started Now
          </NeoButton>
          <NeoButton variant="secondary" size="lg" @click="handleBecomeTutor">
            Become a Tutor
          </NeoButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NeoButton, NeoCard } from '@/components/common/ui';
import HeroSection from './components/HeroSection.vue';
import TutorCard from './components/TutorCard.vue';

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  avatar: string;
}

export default defineComponent({
  name: 'LandingPage',
  components: {
    HeroSection,
    NeoCard,
    NeoButton,
    TutorCard,
  },
  data() {
    return {
      featuredTutors: [
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
      ] as Tutor[],
    };
  },
  methods: {
    handleGetStarted() {
      this.$router.push('/register');
    },
    handleBecomeTutor() {
      this.$router.push('/become-tutor');
    },
    handleViewAllTutors() {
      this.$router.push('/tutors');
    },
  },
});
</script>