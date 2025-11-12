<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="grid grid-cols-12 gap-4 p-4">
        <div v-for="i in 100" :key="i" class="w-2 h-2 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Geometric Shapes -->
    <div class="absolute top-20 right-20 w-40 h-40 border-4 border-black rounded-lg transform rotate-12" style="background-color: var(--color-warning-200);"></div>
    <div class="absolute bottom-20 left-20 w-32 h-32 border-4 border-black rounded-full" style="background-color: var(--color-primary-200);"></div>

    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl w-full">
        <!-- Main Card -->
        <div class="bg-white border-4 border-black rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="bg-warning border-b-4 border-black p-12 text-center">
            <div class="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
              <div class="text-5xl">👨‍🏫</div>
            </div>
            <h1 class="text-4xl font-black text-white mb-4">
              Become a Bimbly Tutor
            </h1>
            <p class="text-xl font-medium text-white mb-8">
              Share your knowledge and help students succeed
            </p>
            <NeoButton variant="secondary" size="lg" @click="$router.push('/register')">
              Apply Now
            </NeoButton>
          </div>

          <!-- Content -->
          <div class="p-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Benefits -->
              <div>
                <h2 class="text-3xl font-black text-gray-900 mb-6">
                  Why Join Bimbly?
                </h2>
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="w-8 h-8 bg-success border-2 border-black rounded flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        Flexible Schedule
                      </h3>
                      <p class="text-lg text-gray-600 font-medium">
                        Teach when it works for you - set your own hours
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="w-8 h-8 bg-primary border-2 border-black rounded flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        Competitive Earnings
                      </h3>
                      <p class="text-lg text-gray-600 font-medium">
                        Earn great money while helping students learn
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="w-8 h-8 bg-warning border-2 border-black rounded flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        Make a Difference
                      </h3>
                      <p class="text-lg text-gray-600 font-medium">
                        Impact students' lives and help them achieve their goals
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Requirements -->
              <div>
                <h2 class="text-3xl font-black text-gray-900 mb-6">
                  Requirements
                </h2>
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-primary border-2 border-black rounded-full"></div>
                    <span class="text-lg font-medium text-gray-900">
                      Expertise in your subject area
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-primary border-2 border-black rounded-full"></div>
                    <span class="text-lg font-medium text-gray-900">
                      Teaching or tutoring experience
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-primary border-2 border-black rounded-full"></div>
                    <span class="text-lg font-medium text-gray-900">
                      Strong communication skills
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-primary border-2 border-black rounded-full"></div>
                    <span class="text-lg font-medium text-gray-900">
                      Passion for helping others learn
                    </span>
                  </div>
                </div>

                <div class="mt-8 p-6 bg-warning-50 border-4 border-black rounded-lg">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">
                    Ready to get started?
                  </h3>
                  <p class="text-lg text-gray-700 font-medium mb-4">
                    Join our community of expert tutors today!
                  </p>
                  <NeoButton variant="primary" size="lg" @click="$router.push('/register')">
                    Start Your Application
                  </NeoButton>
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
import { NeoButton } from '../../components/common/ui';

export default defineComponent({
  name: 'BecomeTutorPage',
  components: {
    NeoButton,
  },
});
</script>