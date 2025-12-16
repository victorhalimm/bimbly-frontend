<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-blue-100 pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

      <div class="max-w-4xl mx-auto">
        <button
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
          @click="$router.back()"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 class="text-3xl md:text-4xl font-black text-gray-900">Book a Session</h1>
        <p class="text-gray-600 mt-2">Fill in the details below to book your tutoring session</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
      <div v-if="loadingTutor" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-500 mt-4">Loading tutor information...</p>
      </div>

      <div v-else-if="tutorError" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Tutor Not Found</h3>
        <p class="text-gray-500 mb-6">{{ tutorError }}</p>
        <button
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all"
          @click="$router.push('/tutors')"
        >
          Browse Tutors
        </button>
      </div>

      <div v-else-if="tutor" class="space-y-6">
        <div class="bg-white rounded-[2rem] shadow-xl p-6">
          <div class="flex items-center gap-4">
            <img
              :src="tutorAvatar"
              :alt="tutor.fullName"
              class="w-20 h-20 rounded-full object-cover bg-blue-100"
            />
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900">{{ tutor.fullName }}</h2>
              <p class="text-gray-500">{{ tutor.city }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex items-center gap-1">
                  <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-bold">{{ Number(tutor.averageRating).toFixed(1) }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <span class="text-sm text-gray-500">{{ tutor.totalSessions }} sessions</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Hourly Rate</p>
              <p class="text-2xl font-black text-blue-600">{{ formattedHourlyRate }}</p>
            </div>
          </div>
        </div>

        <form class="bg-white rounded-[2rem] shadow-xl p-8" @submit.prevent="handleSubmit">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Session Details</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
              <select
                v-model="form.subject"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              >
                <option value="">Select a subject</option>
                <option v-for="subject in availableSubjects" :key="subject" :value="subject">
                  {{ subject }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Subtopic (optional)</label>
              <input
                v-model="form.subtopic"
                type="text"
                placeholder="e.g., Algebra, Trigonometry"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Grade Level *</label>
              <select
                v-model="form.gradeLevel"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              >
                <option value="">Select grade</option>
                <option v-for="grade in availableGrades" :key="grade" :value="grade">
                  Grade {{ grade }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Teaching Method *</label>
              <div class="flex gap-4">
                <label
                  v-for="method in availableMethods"
                  :key="method"
                  class="flex-1 cursor-pointer"
                >
                  <input
                    v-model="form.teachingMethod"
                    type="radio"
                    :value="method"
                    class="sr-only"
                  />
                  <div
                    class="p-4 rounded-xl border-2 text-center font-semibold transition-all"
                    :class="form.teachingMethod === method
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                  >
                    <svg
                      v-if="method === 'online'"
                      class="w-6 h-6 mx-auto mb-2"
                      :class="form.teachingMethod === 'online' ? 'text-blue-600' : 'text-gray-400'"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg
                      v-else
                      class="w-6 h-6 mx-auto mb-2"
                      :class="form.teachingMethod === 'offline' ? 'text-blue-600' : 'text-gray-400'"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ method === 'online' ? 'Online' : 'In-Person' }}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Date *</label>
              <input
                v-model="form.bookingDate"
                type="date"
                :min="minDate"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">Select Time Slots *</label>
              <p class="text-sm text-gray-500 mb-4">
                Choose your session time by selecting consecutive 1-hour slots
              </p>
              <TimeSlotSelector
                v-if="form.bookingDate && tutor"
                :tutor-id="tutor.id"
                :date="form.bookingDate"
                @update:start-time="form.startTime = $event"
                @update:duration-hours="form.durationHours = $event"
              />
              <p v-else class="text-gray-400 italic py-4">
                Please select a date first
              </p>
            </div>

            <div v-if="form.teachingMethod === 'offline'">
              <label class="block text-sm font-bold text-gray-700 mb-2">Location *</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="Enter meeting location"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                :required="form.teachingMethod === 'offline'"
              />
            </div>
          </div>


          <div class="mt-8 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-sm text-gray-500">Total Price</p>
                <p class="text-3xl font-black text-blue-600">{{ formattedTotalPrice }}</p>
                <p class="text-xs text-gray-400">{{ formattedHourlyRate }} x {{ form.durationHours || 0 }} hours</p>
              </div>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Proceed to Payment</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { useBookingStore } from '@/stores/booking.store';
import { useToast } from '@/composables/useToast';
import type { TeachingMethod } from '@/services/booking.service';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector.vue';

interface BookingFormData {
  subject: string;
  subtopic: string;
  gradeLevel: number | '';
  teachingMethod: TeachingMethod | '';
  bookingDate: string;
  startTime: string;
  durationHours: number | '';
  location: string;
}

export default defineComponent({
  name: 'BookingPage',
  components: {
    TimeSlotSelector,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      form: {
        subject: '',
        subtopic: '',
        gradeLevel: '' as number | '',
        teachingMethod: '' as TeachingMethod | '',
        bookingDate: '',
        startTime: '',
        durationHours: '' as number | '',
        location: '',
      } as BookingFormData,
    };
  },
  computed: {
    tutorStore() {
      return useTutorStore();
    },
    bookingStore() {
      return useBookingStore();
    },
    tutor() {
      return this.tutorStore.selectedTutor;
    },
    loadingTutor() {
      return this.tutorStore.loading;
    },
    tutorError() {
      return this.tutorStore.error;
    },
    loading() {
      return this.bookingStore.loading;
    },
    error() {
      return this.bookingStore.error;
    },
    tutorId(): string {
      return this.$route.params.tutorId as string;
    },
    tutorAvatar(): string {
      if (this.tutor?.profileImageUrl) {
        return this.tutor.profileImageUrl;
      }
      const name = this.tutor?.fullName || 'Tutor';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
    },
    formattedHourlyRate(): string {
      if (!this.tutor) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.tutor.hourlyRate);
    },
    formattedTotalPrice(): string {
      const price = this.totalPrice;
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    },
    totalPrice(): number {
      if (!this.tutor || !this.form.durationHours) return 0;
      return Number(this.tutor.hourlyRate) * Number(this.form.durationHours);
    },
    availableSubjects(): string[] {
      return this.tutor?.subjects || [];
    },
    availableGrades(): number[] {
      return this.tutor?.gradeLevels || [];
    },
    availableMethods(): ('online' | 'offline')[] {
      return this.tutor?.teachingMethods || [];
    },
    minDate(): string {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    isFormValid(): boolean {
      const { subject, gradeLevel, teachingMethod, bookingDate, startTime, durationHours, location } = this.form;
      const baseValid = !!(
        subject &&
        gradeLevel &&
        teachingMethod &&
        bookingDate &&
        startTime &&
        durationHours &&
        Number(durationHours) > 0
      );
      if (teachingMethod === 'offline') {
        return baseValid && !!location;
      }
      return baseValid;
    },
  },
  watch: {
    error(newError: string | null) {
      if (newError) {
        this.toast.error('Booking Failed', newError);
      }
    },
  },
  mounted() {
    this.loadTutor();
  },
  beforeUnmount() {
    this.bookingStore.clearError();
  },
  methods: {
    async loadTutor() {
      if (this.tutorId) {
        await this.tutorStore.getTutorById(this.tutorId);
        if (this.tutor && this.tutor.teachingMethods.length === 1) {
          this.form.teachingMethod = this.tutor.teachingMethods[0];
        }
      }
    },
    async handleSubmit() {
      if (!this.isFormValid || !this.tutor) return;

      try {
        const booking = await this.bookingStore.createBooking({
          tutorId: this.tutor.userId,
          subject: this.form.subject,
          subtopic: this.form.subtopic || undefined,
          gradeLevel: Number(this.form.gradeLevel),
          teachingMethod: this.form.teachingMethod as TeachingMethod,
          bookingDate: this.form.bookingDate,
          startTime: this.form.startTime,
          durationHours: Number(this.form.durationHours),
          location: this.form.location || undefined,
        });

        this.toast.success('Booking Created', 'Redirecting to payment...');
        this.$router.push(`/student/bookings/${booking.bookingId}/payment`);
      } catch {
      }
    },
  },
});
</script>
