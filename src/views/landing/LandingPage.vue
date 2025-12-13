
<template>
  <div class="min-h-screen bg-white">
    <HeroSection
      @get-started="handleViewAllTutors"
      @become-tutor="handleBecomeTutor"
    />

    <section class="py-20 pb-48 bg-white relative overflow-hidden">
      <div
        class="absolute top-20 left-20 w-3 h-3 bg-blue-300 rounded-full"
      ></div>
      <div
        class="absolute bottom-40 right-40 w-2 h-2 bg-yellow-300 rounded-full"
      ></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Why students
            <span
              class="text-blue-600"
              style="font-family: 'Comic Sans MS', cursive; font-style: italic"
              >love</span
            >
            Bimbly
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="relative bg-blue-100 rounded-[2.5rem] p-8 hover:scale-105 transition-transform"
          >
            <div
              class="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <IconBooks size="32" stroke="2" class="text-blue-600" />
            </div>
            <div class="mt-8">
              <h3 class="text-2xl font-black text-gray-900 mb-3">
                Qualified
                <span
                  class="block"
                  style="
                    font-family: 'Comic Sans MS', cursive;
                    font-style: italic;
                  "
                  >Tutors</span
                >
              </h3>
              <p class="text-gray-700">
                Connect with verified tutors who have proven teaching experience
                in their subjects.
              </p>
            </div>
          </div>

          <div
            class="relative bg-blue-600 rounded-[2.5rem] p-8 text-white hover:scale-105 transition-transform"
          >
            <div
              class="absolute top-6 right-6 w-12 h-12 bg-blue-700 rounded-full opacity-50"
            ></div>
            <div
              class="absolute bottom-8 right-12 w-8 h-8 bg-blue-700 rounded-full opacity-30"
            ></div>
            <div class="relative z-10">
              <div
                class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <IconBulb size="32" stroke="2" class="text-blue-600" />
              </div>
              <h3 class="text-2xl font-black mb-3">
                Flexible
                <span
                  class="block"
                  style="
                    font-family: 'Comic Sans MS', cursive;
                    font-style: italic;
                  "
                  >Scheduling</span
                >
              </h3>
              <p class="text-blue-100">
                Book sessions that fit your schedule, whether online or
                in-person at your convenience.
              </p>
            </div>
          </div>

          <div
            class="relative bg-yellow-200 rounded-[2.5rem] p-8 hover:scale-105 transition-transform"
          >
            <div
              class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12"
            >
              <IconCoins
                size="32"
                stroke="2"
                class="text-yellow-600 -rotate-12"
              />
            </div>
            <div class="mt-8">
              <h3 class="text-2xl font-black text-gray-900 mb-3">
                Affordable
                <span
                  class="block"
                  style="
                    font-family: 'Comic Sans MS', cursive;
                    font-style: italic;
                  "
                  >Pricing</span
                >
              </h3>
              <p class="text-gray-700">
                Quality education at prices that fit your budget, with
                transparent hourly rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 py-20"
    >
      <div
        class="absolute top-20 left-10 w-24 h-24 bg-yellow-400 rounded-full"
      ></div>
      <div class="absolute top-32 right-20 w-3 h-3 bg-white rounded-full"></div>
      <div
        class="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-200 rounded-full"
      ></div>
      <div
        class="absolute bottom-32 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl"
      ></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div class="text-white mb-16 max-w-4xl mx-auto text-center">
          <div class="relative">
            <p class="text-3xl lg:text-4xl leading-relaxed mb-3">
              Our mission is to make every student
            </p>
            <p
              class="text-5xl lg:text-6xl font-black leading-tight mb-3"
              style="
                font-family: 'Comic Sans MS', cursive;
                font-style: italic;
                color: #fde047;
              "
            >
              unlock their full potential
            </p>
            <p class="text-3xl lg:text-4xl leading-relaxed">
              through personalized one-on-one tutoring that makes learning engaging, effective, and accessible for everyone.
            </p>
          </div>
        </div>

        <div class="relative">
          <div
            class="flex justify-center items-center gap-8 overflow-x-auto pb-8 hide-scrollbar"
          >
            <div
              v-for="(tutor, index) in featuredTutors"
              :key="tutor.id"
              class="shrink-0 text-center w-40"
            >
              <div class="relative w-40 h-40 mx-auto mb-5">
                <div
                  class="relative z-10 bg-white border-4 border-white shadow-2xl overflow-hidden w-full h-full"
                  :style="getOrganicBorderRadius(index)"
                >
                  <div
                    class="w-full h-full bg-gradient-to-br from-blue-100 to-yellow-50 flex items-center justify-center text-7xl"
                  >
                    {{ tutor.emoji }}
                  </div>
                </div>
              </div>
              <h3 class="text-lg font-bold text-white mb-1">
                {{ tutor.fullName }}
              </h3>
              <p class="text-sm text-blue-100">
                {{ tutor.subjects.join(', ') }} Teacher
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white pt-32">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          class="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-[3rem] p-12 lg:p-16 text-white relative overflow-hidden"
        >
          <div
            class="absolute top-10 right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-30 blur-2xl"
          ></div>
          <div
            class="absolute bottom-10 left-20 w-32 h-32 bg-blue-700 rounded-full opacity-40"
          ></div>

          <div class="relative z-10 max-w-3xl">
            <h2 class="text-4xl lg:text-5xl font-black mb-4">
              Ready to
              <span
                class="block mt-2"
                style="
                  font-family: 'Comic Sans MS', cursive;
                  font-style: italic;
                  color: #fde047;
                "
              >
                excel in your studies
              </span>
              <span class="block">with the perfect tutor?</span>
            </h2>
            <p class="text-lg text-blue-100 mt-6 mb-8 max-w-2xl">
              Join thousands of students who are achieving their academic goals
              with personalized tutoring from qualified experts.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="handleViewAllTutors"
                class="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
              >
                Find Your Tutor
                <div
                  class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              <button
                @click="handleBecomeTutor"
                class="inline-flex items-center gap-3 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg"
              >
                Become a Tutor
              </button>
            </div>
          </div>

          <div class="absolute bottom-0 right-0 w-64 h-64 hidden lg:block">
            <div class="relative w-full h-full">
              <div
                class="absolute bottom-8 right-8 w-40 h-40 bg-blue-400 rounded-full opacity-50"
              ></div>
              <div class="absolute bottom-16 right-16 text-8xl">🎯</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gradient-to-b from-white to-blue-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Everything you need to
            <span class="relative inline-block mx-2">
              <span
                class="text-blue-600"
                style="
                  font-family: 'Comic Sans MS', cursive;
                  font-style: italic;
                "
                >succeed</span
              >
              <svg
                class="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <ellipse
                  cx="100"
                  cy="4"
                  rx="98"
                  ry="3"
                  fill="#FDE047"
                  opacity="0.6"
                />
              </svg>
            </span>
            <span class="block mt-2">in one platform</span>
          </h2>
          <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Track your progress, manage sessions, and connect with tutors - all
            in one convenient platform designed for your success.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div
              class="bg-white rounded-[2rem] p-6 shadow-lg flex items-start gap-4 hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0"
              >
                <IconBook size="32" stroke="2" class="text-blue-600" />
              </div>
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-2">
                  Easy Booking System
                </h3>
                <p class="text-gray-600">
                  Find and book tutoring sessions with just a few clicks,
                  anytime you need help.
                </p>
              </div>
            </div>

            <div
              class="bg-white rounded-[2rem] p-6 shadow-lg flex items-start gap-4 hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0"
              >
                <IconMessageCircle
                  size="32"
                  stroke="2"
                  class="text-yellow-600"
                />
              </div>
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-2">
                  Real-Time Chat
                </h3>
                <p class="text-gray-600">
                  Communicate directly with your tutors before and after
                  sessions for better learning outcomes.
                </p>
              </div>
            </div>

            <div
              class="bg-white rounded-[2rem] p-6 shadow-lg flex items-start gap-4 hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0"
              >
                <IconChartBar size="32" stroke="2" class="text-green-600" />
              </div>
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-2">
                  Progress Reports
                </h3>
                <p class="text-gray-600">
                  Track your academic improvement with detailed reports from
                  your tutors after each session.
                </p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 rounded-[3rem] aspect-square flex items-center justify-center"
            >
              <div class="text-center">
                <div class="mb-4 flex justify-center">
                  <IconSchool size="120" stroke="2" class="text-blue-600" />
                </div>
                <div
                  class="text-3xl font-black text-gray-900"
                  style="
                    font-family: 'Comic Sans MS', cursive;
                    font-style: italic;
                  "
                >
                  Your Success Starts Here!
                </div>
              </div>
            </div>
            <div
              class="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-300 rounded-full opacity-50"
            ></div>
            <div
              class="absolute -top-6 -left-6 w-24 h-24 bg-blue-400 rounded-full opacity-40"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeroSection from './components/HeroSection.vue'
import type { TutorData } from '@/components/tutor/TutorCard.vue'
import {
  IconBooks,
  IconBulb,
  IconCoins,
  IconBook,
  IconMessageCircle,
  IconChartBar,
  IconSchool
} from '@tabler/icons-vue'
import Navbar from '@/components/common/layout/Navbar.vue'

export default defineComponent({
  name: 'LandingPage',
  components: {
    HeroSection,
    IconBooks,
    IconBulb,
    IconCoins,
    IconBook,
    IconMessageCircle,
    IconChartBar,
    IconSchool,
    Navbar
  },
  data() {
    return {
      featuredTutors: [
        {
          id: '1',
          userId: 'user-1',
          fullName: 'Kristin Watson',
          emoji: '👩‍🏫',
          profileImageUrl: null,
          bio: 'Science Teacher with 8+ years helping students excel in biology and chemistry',
          subjects: ['Science'],
          gradeLevels: [10, 11, 12],
          teachingMethods: ['online', 'offline'] as ('online' | 'offline')[],
          hourlyRate: 150000,
          city: 'Jakarta',
          province: 'DKI Jakarta',
          averageRating: 4.9,
          totalReviews: 127,
          totalSessions: 250,
          teachingExperienceYears: 8
        },
        {
          id: '2',
          userId: 'user-2',
          fullName: 'Jenny Wilson',
          emoji: '👨‍🏫',
          profileImageUrl: null,
          bio: 'Drawing Teacher passionate about unleashing creativity in students',
          subjects: ['Art', 'Drawing'],
          gradeLevels: [7, 8, 9, 10],
          teachingMethods: ['online'] as ('online' | 'offline')[],
          hourlyRate: 125000,
          city: 'Bandung',
          province: 'Jawa Barat',
          averageRating: 4.8,
          totalReviews: 95,
          totalSessions: 180,
          teachingExperienceYears: 6
        },
        {
          id: '3',
          userId: 'user-3',
          fullName: 'Jacob Jones',
          emoji: '👨‍💼',
          profileImageUrl: null,
          bio: 'Math Teacher making numbers fun and easy to understand',
          subjects: ['Mathematics'],
          gradeLevels: [10, 11, 12],
          teachingMethods: ['online', 'offline'] as ('online' | 'offline')[],
          hourlyRate: 175000,
          city: 'Surabaya',
          province: 'Jawa Timur',
          averageRating: 4.9,
          totalReviews: 156,
          totalSessions: 300,
          teachingExperienceYears: 10
        },
        {
          id: '4',
          userId: 'user-4',
          fullName: 'Sarah Chen',
          emoji: '👩‍🏫',
          profileImageUrl: null,
          bio: 'English Teacher helping students master language skills',
          subjects: ['English'],
          gradeLevels: [7, 8, 9, 10, 11, 12],
          teachingMethods: ['online', 'offline'] as ('online' | 'offline')[],
          hourlyRate: 140000,
          city: 'Jakarta',
          province: 'DKI Jakarta',
          averageRating: 4.8,
          totalReviews: 110,
          totalSessions: 220,
          teachingExperienceYears: 7
        }
      ] as (TutorData & { emoji: string })[]
    }
  },
  methods: {
    handleBecomeTutor(): void {
      this.$router.push('/become-tutor')
    },
    handleViewAllTutors(): void {
      this.$router.push('/tutors')
    },
    handleViewTutorProfile(tutorId: string): void {
      this.$router.push(`/tutors/${tutorId}`)
    },
    formatPrice(price: number): string {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    getOrganicBorderRadius(index: number): string {
      const organicShapes = [
        'border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%',
        'border-radius: 47% 53% 42% 58% / 63% 44% 56% 37%',
        'border-radius: 58% 42% 61% 39% / 48% 55% 45% 52%',
        'border-radius: 52% 48% 33% 67% / 57% 43% 57% 43%'
      ]
      return organicShapes[index % organicShapes.length]
    }
  }
})
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
