<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div
        class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-12">
      <NeoAlert variant="error" :message="error" />
      <div class="text-center mt-8">
        <button
          class="bg-primary-500 text-white font-bold py-3 px-8 rounded-xl border-4 border-black hover:-translate-y-1 transition-transform"
          @click="$router.push('/tutors')"
        >
          Back to Search
        </button>
      </div>
    </div>

    <div v-else-if="tutor" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section
        class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8 mb-8"
      >
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-shrink-0">
            <img
              :src="avatarUrl"
              :alt="tutor.user?.fullName"
              class="w-40 h-40 rounded-full border-4 border-black object-cover mx-auto lg:mx-0"
            />
          </div>

          <div class="flex-1">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 class="text-3xl font-black text-gray-900">{{ tutor.user?.fullName }}</h1>
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      :class="
                        star <= Math.round(tutor.averageRating)
                          ? 'text-warning-500'
                          : 'text-gray-300'
                      "
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                  <span class="text-xl font-black text-gray-900">
                    {{ tutor.averageRating.toFixed(1) }}
                  </span>
                  <span class="text-gray-600">({{ tutor.totalReviews }} reviews)</span>
                </div>
                <p class="text-gray-600 mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ tutor.city }}, {{ tutor.province }}
                </p>
              </div>

              <div class="text-center lg:text-right">
                <p class="text-sm text-gray-500 mb-1">Hourly Rate</p>
                <p class="text-3xl font-black text-primary-600">{{ formattedPrice }}</p>
                <div class="mt-4 space-y-2">
                  <button
                    class="w-full bg-primary-500 text-white font-black py-3 px-8 rounded-xl border-4 border-black shadow-lg hover:-translate-y-1 transition-transform"
                  >
                    Book Session
                  </button>
                  <button
                    class="w-full bg-white text-gray-700 font-bold py-3 px-8 rounded-xl border-4 border-black shadow-lg hover:-translate-y-1 transition-transform"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <section class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-black text-gray-900 mb-4">About</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ tutor.bio }}</p>

            <div class="mt-6">
              <h3 class="text-lg font-black text-gray-900 mb-2">Education Background</h3>
              <p class="text-gray-700">{{ tutor.educationBackground }}</p>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-black text-gray-900 mb-2">Teaching Experience</h3>
              <p class="text-gray-700">
                {{ tutor.teachingExperienceYears }} years of experience
              </p>
              <p class="text-gray-600">{{ tutor.totalSessions }} total sessions completed</p>
            </div>

            <div v-if="tutor.specializations?.length" class="mt-6">
              <h3 class="text-lg font-black text-gray-900 mb-2">Specializations</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="spec in tutor.specializations"
                  :key="spec"
                  class="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-sm rounded-full border-2 border-gray-300"
                >
                  {{ spec }}
                </span>
              </div>
            </div>
          </section>

          <section class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-black text-gray-900 mb-4">Teaching Details</h2>

            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-bold text-gray-700 mb-2">Subjects</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="subject in tutor.subjects"
                    :key="subject"
                    class="px-4 py-2 bg-primary-100 text-primary-700 font-bold rounded-xl border-2 border-primary-500"
                  >
                    {{ subject }}
                  </span>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-700 mb-2">Grade Levels</h3>
                <p class="text-gray-900 font-semibold">{{ formattedGradeLevels }}</p>
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-700 mb-2">Teaching Methods</h3>
                <div class="flex gap-3">
                  <span
                    v-for="method in tutor.teachingMethods"
                    :key="method"
                    class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-300"
                  >
                    <svg
                      v-if="method === 'online'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.805A1 1 0 0112 18H8a1 1 0 01-.707-1.706l.804-.805L8.22 15H6a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                      />
                    </svg>
                    {{ method === 'online' ? 'Online' : 'Offline' }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section
            v-if="tutor.certifications?.length"
            class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8"
          >
            <h2 class="text-2xl font-black text-gray-900 mb-4">Certifications</h2>
            <div class="space-y-3">
              <div
                v-for="cert in tutor.certifications"
                :key="cert.name"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
              >
                <div class="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-primary-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-semibold">{{ cert.name }}</span>
                </div>
                <a
                  :href="cert.fileUrl"
                  target="_blank"
                  class="text-primary-600 font-bold hover:underline"
                >
                  View
                </a>
              </div>
            </div>
          </section>

          <section class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-black text-gray-900 mb-6">Reviews</h2>

            <div v-if="!reviews || reviews.data.length === 0" class="text-center py-8">
              <p class="text-gray-500">No reviews yet</p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="review in reviews.data"
                :key="review.id"
                class="border-b-2 border-gray-200 pb-6 last:border-0"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-gray-900">{{ review.studentName }}</span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(review.createdAt) }}
                  </span>
                </div>
                <div class="flex items-center gap-1 mb-2">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :class="star <= review.rating ? 'text-warning-500' : 'text-gray-300'"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <p class="text-gray-700">{{ review.reviewText }}</p>
                <div
                  v-if="review.tutorResponse"
                  class="mt-3 bg-gray-50 p-4 rounded-xl border-l-4 border-primary-500"
                >
                  <p class="text-sm font-bold text-gray-900 mb-1">Tutor Response:</p>
                  <p class="text-gray-700 text-sm">{{ review.tutorResponse }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-8">
          <section class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
            <h2 class="text-xl font-black text-gray-900 mb-4">Availability</h2>

            <div v-if="availability" class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">{{ availability.date }}</p>
                <p class="font-bold capitalize">{{ availability.dayOfWeek }}</p>
              </div>

              <div v-if="availability.availableSlots.length === 0" class="text-gray-500">
                No available slots for this day
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="(slot, index) in availability.availableSlots"
                  :key="index"
                  class="p-3 bg-success-50 rounded-lg border-2 border-success-500"
                >
                  <p class="font-semibold text-success-700">
                    {{ slot.start }} - {{ slot.end }}
                  </p>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-bold text-gray-700 mb-2">Check date:</label>
                <input
                  v-model="selectedDate"
                  type="date"
                  class="w-full px-4 py-2 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
                  @change="handleDateChange"
                />
              </div>
            </div>
          </section>

          <div class="bg-white border-4 border-black rounded-2xl shadow-2xl p-8">
            <h3 class="text-lg font-black text-gray-900 mb-4">Quick Stats</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Sessions</span>
                <span class="font-bold">{{ tutor.totalSessions }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Reviews</span>
                <span class="font-bold">{{ tutor.totalReviews }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Experience</span>
                <span class="font-bold">{{ tutor.teachingExperienceYears }} years</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Member Since</span>
                <span class="font-bold">{{ memberSince }}</span>
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
      if (grades.length === 0) return 'N/A';
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
