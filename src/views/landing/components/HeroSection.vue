<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden py-20 lg:py-40 min-h-screen">
    <div class="absolute top-10 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl animate-blob"></div>
    <div class="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

    <div class="absolute top-1/4 left-10 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
    <div class="absolute bottom-1/3 right-20 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
    <div class="absolute top-1/2 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1500"></div>

    <div class="absolute top-20 left-1/3 w-32 h-32 opacity-20 animate-pulse-slow" style="background: radial-gradient(circle, #3b82f6 0%, transparent 70%); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;"></div>
    <div class="absolute bottom-40 right-1/4 w-24 h-24 opacity-15 animate-pulse-slow animation-delay-1000" style="background: radial-gradient(circle, #eab308 0%, transparent 70%); border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%;"></div>

    <div class="absolute top-20 left-20 hidden lg:block">
      <div class="relative w-48 h-48">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full opacity-50" style="border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-5xl">
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-32 right-32 hidden lg:block">
      <div class="relative w-40 h-40">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full opacity-50" style="border-radius: 47% 53% 42% 58% / 63% 44% 56% 37%;"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center text-4xl">
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
      <div class="text-center">
        <div class="mb-8">
          <h1 class="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-4">
            The best place to
            <span class="block mt-3">
              <span class="relative inline-block">
                <span class="highlight-box highlight-box-blue"></span>
                <span class="relative z-10 text-blue-700">learn</span>
              </span>
              <span class="mx-3">and</span>
              <span class="relative inline-block">
                <span class="highlight-box highlight-box-yellow"></span>
                <span class="relative z-10 text-yellow-600">find tutors</span>
              </span>
            </span>
            <span class="block mt-3">for students</span>
          </h1>

          <p class="text-lg lg:text-xl text-gray-600 mt-8 max-w-3xl mx-auto leading-relaxed">
            Connect with qualified tutors for Math, Science, English, and more. Get personalized learning that fits your schedule and budget.
          </p>
        </div>

        <button @click="handleGetStarted" class="group relative inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-xl">
          Find Your Tutor
          <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform animate-pulse-arrow">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </button>

        <div class="mt-16 flex items-center justify-center gap-3">
          <div class="relative w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <div class="w-full h-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-2xl">
              👨‍🎓
            </div>
          </div>
          <div class="relative w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden -ml-4">
            <div class="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center text-2xl">
              👩‍🏫
            </div>
          </div>
          <div class="relative w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden -ml-4">
            <div class="w-full h-full bg-gradient-to-br from-green-200 to-green-100 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
          </div>
          <div class="ml-3">
            <div class="text-sm font-bold text-gray-900">Join 5,000+ students</div>
            <div class="text-xs text-gray-500">already learning with us</div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-20">
      <svg preserveAspectRatio="none" viewBox="0 0 1200 120" fill="white" class="w-full h-full">
        <path d="M0,0 C150,60 350,60 600,30 C850,0 1050,0 1200,30 L1200,120 L0,120 Z"></path>
      </svg>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeroSection',
  methods: {
    handleGetStarted(): void {
      this.$emit('get-started');
    },
    handleBecomeTutor(): void {
      this.$emit('become-tutor');
    },
  },
  emits: ['get-started', 'become-tutor'],
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.02);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.05);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes draw-line {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

@keyframes pulse-arrow {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}

.animate-draw-line {
  animation: draw-line 1s ease-in-out 1s forwards;
}

.animate-pulse-arrow {
  animation: pulse-arrow 1.5s ease-in-out infinite;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
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

.highlight-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% + 16px);
  height: 70%;
  transform: translate(-50%, -50%) rotate(-2deg);
  border-radius: 8px;
  z-index: 0;
}

.highlight-box-blue {
  background-color: rgba(191, 219, 254, 0.7);
}

.highlight-box-yellow {
  background-color: rgba(254, 240, 138, 0.7);
  transform: translate(-50%, -50%) rotate(1deg);
}
</style>
