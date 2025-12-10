<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-12">
      <NeoAlert variant="error" :message="error" />
      <div class="text-center mt-8">
        <button
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
          @click="$router.push('/tutors')"
        >
          Back to Search
        </button>
      </div>
    </div>

    <div v-else-if="tutor">
      <div class="bg-blue-100 pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

        <div class="max-w-6xl mx-auto">
          <button
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
            @click="$router.back()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/3 relative">
              <div class="aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  :src="avatarUrl"
                  :alt="tutor.user?.fullName"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <svg class="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div class="lg:w-2/3 p-8 lg:p-10">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div class="flex-1">
                  <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-2">{{ tutor.user?.fullName }}</h1>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="font-bold text-gray-900">{{ Number(tutor.averageRating).toFixed(1) }}</span>
                      <span class="text-gray-500 text-sm">({{ tutor.totalReviews }})</span>
                    </div>
                    <span class="text-gray-400">|</span>
                    <span class="text-gray-600 flex items-center gap-1">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ tutor.city }}
                    </span>
                  </div>

                  <p class="text-gray-600 leading-relaxed mb-6 line-clamp-3">{{ tutor.bio }}</p>

                  <div class="flex flex-wrap gap-2 mb-6">
                    <span
                      v-for="subject in tutor.subjects"
                      :key="subject"
                      class="px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full"
                    >
                      {{ subject }}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      {{ tutor.totalSessions }} sessions
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      {{ tutor.teachingExperienceYears }} years exp.
                    </span>
                  </div>
                </div>

                <div class="lg:text-right lg:min-w-[200px]">
                  <p class="text-sm text-gray-500 mb-1">Hourly Rate</p>
                  <p class="text-3xl font-black text-blue-600 mb-4">{{ formattedPrice }}</p>
                  <div class="space-y-3">
                    <button class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg">
                      Book Session
                    </button>
                    <button class="w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                About Me
              </h2>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ tutor.bio }}</p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Education</h3>
                  <p class="text-gray-900 font-medium">{{ tutor.educationBackground }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Experience</h3>
                  <p class="text-gray-900 font-medium">{{ tutor.teachingExperienceYears }} years of teaching</p>
                </div>
              </div>

              <div v-if="tutor.specializations?.length" class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Specializations</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="spec in tutor.specializations"
                    :key="spec"
                    class="px-3 py-1.5 bg-purple-50 text-purple-700 font-medium text-sm rounded-full"
                  >
                    {{ spec }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Teaching Details
              </h2>

              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Subjects</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="subject in tutor.subjects"
                      :key="subject"
                      class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl"
                    >
                      {{ subject }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Grade Levels</h3>
                  <p class="text-gray-900 font-semibold text-lg">{{ formattedGradeLevels }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Teaching Methods</h3>
                  <div class="flex gap-3">
                    <span
                      v-for="method in tutor.teachingMethods"
                      :key="method"
                      class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold"
                      :class="method === 'online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                    >
                      <svg v-if="method === 'online'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ method === 'online' ? 'Online' : 'In-Person' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="tutor.certifications?.length" class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                Certifications
              </h2>
              <div class="space-y-3">
                <div
                  v-for="cert in tutor.certifications"
                  :key="cert.name"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span class="font-semibold text-gray-900">{{ cert.name }}</span>
                  </div>
                  <a
                    :href="cert.fileUrl"
                    target="_blank"
                    class="text-blue-600 font-bold text-sm hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                Reviews
                <span class="ml-auto text-sm font-medium text-gray-500">{{ tutor.totalReviews }} reviews</span>
              </h2>

              <div v-if="!reviews || reviews.data.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p class="text-gray-500">No reviews yet</p>
              </div>

              <div v-else class="space-y-6">
                <div
                  v-for="review in reviews.data"
                  :key="review.id"
                  class="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {{ review.studentName?.charAt(0) || 'S' }}
                      </div>
                      <div>
                        <p class="font-bold text-gray-900">{{ review.studentName }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg v-for="star in 5" :key="star" class="h-4 w-4" :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ review.reviewText }}</p>
                  <div v-if="review.tutorResponse" class="mt-4 bg-blue-50 p-4 rounded-xl">
                    <p class="text-sm font-bold text-blue-900 mb-1">Tutor Response</p>
                    <p class="text-blue-800 text-sm">{{ review.tutorResponse }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-6 sticky top-6">
              <h3 class="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <span class="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Availability
              </h3>

              <div v-if="availability" class="space-y-4">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-sm text-gray-500">{{ availability.date }}</p>
                  <p class="font-bold text-gray-900 capitalize">{{ availability.dayOfWeek }}</p>
                </div>

                <div v-if="availability.availableSlots.length === 0" class="text-center py-6">
                  <p class="text-gray-500 text-sm">No available slots</p>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="(slot, index) in availability.availableSlots"
                    :key="index"
                    class="p-3 bg-green-50 rounded-xl border border-green-200"
                  >
                    <p class="font-semibold text-green-700 text-sm">
                      {{ slot.start }} - {{ slot.end }}
                    </p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Check date:</label>
                  <input
                    v-model="selectedDate"
                    type="date"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    @change="handleDateChange"
                  />
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[1.5rem] shadow-lg p-6 text-white">
              <h3 class="text-lg font-black mb-4">Quick Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Total Sessions</span>
                  <span class="font-black text-xl">{{ tutor.totalSessions }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Total Reviews</span>
                  <span class="font-black text-xl">{{ tutor.totalReviews }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Experience</span>
                  <span class="font-black text-xl">{{ tutor.teachingExperienceYears }} yrs</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-white/20">
                  <span class="text-blue-100">Member Since</span>
                  <span class="font-bold text-sm">{{ memberSince }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-16"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { NeoAlert } from '@/components/common/ui';

export default defineComponent({
  name: 'TutorProfilePublic',
  components: {
    NeoAlert,
  },
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    tutorStore() {
      return useTutorStore();
    },
    tutor() {
      return this.tutorStore.selectedTutor;
    },
    reviews() {
      return this.tutorStore.reviews;
    },
    availability() {
      return this.tutorStore.availability;
    },
    loading() {
      return this.tutorStore.loading;
    },
    error() {
      return this.tutorStore.error;
    },
    avatarUrl(): string {
      if (this.tutor?.user?.profileImageUrl) {
        return this.tutor.user.profileImageUrl;
      }
      const name = this.tutor?.user?.fullName || 'Unknown';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=256`;
    },
    formattedPrice(): string {
      if (!this.tutor) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.tutor.hourlyRate);
    },
    formattedGradeLevels(): string {
      if (!this.tutor) return '';
      const grades = [...this.tutor.gradeLevels].sort((a, b) => a - b);
      if (grades.length === 0) return 'All levels';
      if (grades.length === 1) return `Grade ${grades[0]}`;

      const ranges: string[] = [];
      let start = grades[0];
      let end = grades[0];

      for (let i = 1; i < grades.length; i++) {
        if (grades[i] === end + 1) {
          end = grades[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = grades[i];
          end = grades[i];
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);

      return `Grade ${ranges.join(', ')}`;
    },
    memberSince(): string {
      if (!this.tutor) return '';
      return new Date(this.tutor.createdAt).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
  },
  mounted() {
    const tutorId = this.$route.params.id as string;
    this.loadTutorData(tutorId);
  },
  beforeUnmount() {
    this.tutorStore.clearSelectedTutor();
  },
  methods: {
    async loadTutorData(id: string) {
      await this.tutorStore.getTutorById(id);
      if (this.tutor) {
        this.tutorStore.getTutorReviews(id);
        this.tutorStore.getTutorAvailability(id, this.selectedDate);
      }
    },
    handleDateChange() {
      if (this.tutor) {
        this.tutorStore.getTutorAvailability(this.tutor.id, this.selectedDate);
      }
    },
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
  },
});
</script>
