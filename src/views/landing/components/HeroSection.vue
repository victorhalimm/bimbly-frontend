<template>
  <section class="relative bg-primary overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 opacity-10">
        <div class="grid grid-cols-12 gap-4 p-4">
          <div v-for="i in 50" :key="i" class="w-2 h-2 bg-white rounded"></div>
        </div>
      </div>
    </div>

    <!-- Geometric Shapes -->
    <div class="absolute top-10 left-10 w-32 h-32 border-4 border-black rounded-lg transform rotate-12" style="background-color: var(--color-primary-800);"></div>
    <div class="absolute bottom-20 right-20 w-24 h-24 border-4 border-black rounded-full" style="background-color: var(--color-primary-700);"></div>
    <div class="absolute top-40 right-40 w-16 h-16 border-4 border-black transform rotate-45" style="background-color: var(--color-primary-600);"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="relative z-10">
          <div class="inline-block">
            <span class="bg-white text-primary text-sm font-bold px-4 py-2 border-2 border-black rounded-full">
              #1 TUTORING PLATFORM IN INDONESIA
            </span>
          </div>

          <h1 class="mt-6 text-5xl lg:text-6xl font-black text-white leading-tight">
            Find the Perfect
            <span class="block text-yellow-300">Tutor</span>
            for Your Success
          </h1>

          <p class="mt-6 text-xl text-white font-medium leading-relaxed">
            Connect with qualified tutors for Math, Science, English, and more.
            Get personalized learning that fits your schedule and budget.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <NeoButton variant="secondary" size="lg" @click="handleGetStarted">
              Find Your Tutor
            </NeoButton>
            <NeoButton variant="success" size="lg" @click="handleBecomeTutor">
              Become a Tutor
            </NeoButton>
          </div>

          <!-- Social Proof -->
          <div class="mt-12 flex items-center space-x-8">
            <div class="text-left">
              <div class="text-3xl font-black text-white">5,000+</div>
              <div class="text-sm text-yellow-200 font-medium">Active Students</div>
            </div>
            <div class="text-left">
              <div class="text-3xl font-black text-white">1,000+</div>
              <div class="text-sm text-yellow-200 font-medium">Expert Tutors</div>
            </div>
            <div class="text-left">
              <div class="text-3xl font-black text-white">50,000+</div>
              <div class="text-sm text-yellow-200 font-medium">Sessions Completed</div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="relative z-10">
          <div class="relative">
            <!-- Main Card -->
            <div class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
              <!-- Student Illustration Placeholder -->
              <div class="h-64 border-2 border-black rounded-lg flex items-center justify-center" style="background: linear-gradient(to bottom right, var(--color-primary-100), var(--color-success));">
                <div class="text-center">
                  <div class="text-6xl mb-2">🎓</div>
                  <div class="text-lg font-bold text-gray-900">Student Success</div>
                </div>
              </div>

              <!-- Features -->
              <div class="mt-6 space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-success border-2 border-black rounded-full"></div>
                  <span class="text-lg font-medium text-gray-900">Verified Expert Tutors</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-primary border-2 border-black rounded-full"></div>
                  <span class="text-lg font-medium text-gray-900">Flexible Scheduling</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-warning border-2 border-black rounded-full"></div>
                  <span class="text-lg font-medium text-gray-900">Affordable Pricing</span>
                </div>
              </div>
            </div>

            <!-- Floating Elements -->
            <div class="absolute -top-4 -right-4 w-20 h-20 border-4 border-black rounded-lg flex items-center justify-center animate-pulse" style="background-color: var(--color-warning-400);">
              <div class="text-center">
                <div class="text-2xl">⭐</div>
                <div class="text-xs font-bold">4.9</div>
              </div>
            </div>

            <div class="absolute -bottom-4 -left-4 w-16 h-16 border-4 border-black rounded-full flex items-center justify-center" style="background-color: var(--color-success);">
              <div class="text-xl">📈</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Wave -->
    <div class="absolute bottom-0 left-0 w-full">
      <svg preserveAspectRatio="none" class="w-full h-12" viewBox="0 0 1440 100" fill="#F9FAFB" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 50L60 25C120 0 120 0 180 25C240 50 240 50 300 25C360 0 360 0 420 25C480 50 480 50 540 25C600 0 600 0 660 25C720 50 720 50 780 25C840 0 840 0 900 25C960 50 960 50 1020 25C1080 0 1080 0 1140 25C1200 50 1200 50 1260 25C1320 0 1320 0 1380 25L1440 50V100H1380C1320 100 1320 100 1260 100C1200 100 1200 100 1140 100C1080 100 1080 100 1020 100C960 100 960 100 900 100C840 100 840 100 780 100C720 100 720 100 660 100C600 100 600 100 540 100C480 100 480 100 420 100C360 100 360 100 300 100C240 100 240 100 180 100C120 100 120 100 60 100L0 100V50Z"/>
      </svg>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NeoButton from '@/components/common/ui/NeoButton.vue';

export default defineComponent({
  name: 'HeroSection',
  components: {
    NeoButton,
  },
  methods: {
    handleGetStarted() {
      this.$emit('get-started');
    },
    handleBecomeTutor() {
      this.$emit('become-tutor');
    },
  },
  emits: ['get-started', 'become-tutor'],
});
</script>