<template>
  <div class="bg-white rounded-[2rem] shadow-lg p-6 hover:shadow-xl transition-all">
    <div class="flex items-start gap-4">
      <img
        :src="userImage"
        :alt="userName"
        class="w-16 h-16 rounded-full object-cover bg-blue-100"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="text-lg font-bold text-gray-900 truncate">{{ userName }}</h3>
            <p class="text-sm text-gray-500">{{ booking.subject }}</p>
          </div>
          <span
            class="flex-shrink-0 px-3 py-1 text-xs font-bold rounded-full"
            :class="statusClass"
          >
            {{ statusLabel }}
          </span>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formattedDate }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ booking.startTime }} ({{ booking.durationHours }}h)</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Grade {{ booking.gradeLevel }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <svg v-if="booking.teachingMethod === 'online'" class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ booking.teachingMethod === 'online' ? 'Online' : 'In-person' }}</span>
          </div>
        </div>

        <div v-if="showLocationInfo" class="mt-3 p-3 bg-gray-50 rounded-xl">
          <div class="flex items-center gap-2 text-sm">
            <svg v-if="booking.teachingMethod === 'online'" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <svg v-else class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span v-if="booking.teachingMethod === 'online' && booking.meetingUrl" class="text-gray-700 font-medium truncate">
              <a :href="booking.meetingUrl" target="_blank" class="text-blue-600 hover:underline">{{ booking.meetingUrl }}</a>
            </span>
            <span v-else-if="booking.teachingMethod === 'offline' && booking.location" class="text-gray-700 font-medium">
              {{ booking.location }}
            </span>
            <span v-else class="text-gray-400 italic">Location not set</span>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between flex-wrap gap-2">
          <p class="text-lg font-bold text-blue-600">{{ formattedPrice }}</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="showViewPaymentButton"
              class="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              @click="$emit('viewPayment', booking.bookingId)"
            >
              View Payment
            </button>
            <button
              v-if="showViewSummaryButton"
              class="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
              @click="$emit('viewSummary', booking.bookingId)"
            >
              View Summary
            </button>
            <button
              v-if="showCancelButton"
              class="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              @click="$emit('cancel', booking.bookingId)"
            >
              Cancel
            </button>
            <button
              v-if="showConfirmButton"
              class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              @click="$emit('confirm', booking.bookingId)"
            >
              Confirm
            </button>
            <button
              v-if="showTutorCompleteButton"
              class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              @click="$emit('complete', booking.bookingId)"
            >
              Complete
            </button>
            <button
              v-if="showStudentCompleteButton"
              class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              @click="$emit('studentComplete', booking.bookingId)"
            >
              Confirm Complete
            </button>
            <button
              v-if="showReviewButton"
              class="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
              @click="$emit('review', booking.bookingId)"
            >
              Review
            </button>
            <a
              v-if="showJoinButton && booking.meetingUrl"
              :href="booking.meetingUrl"
              target="_blank"
              class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            >
              Join
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Booking, BookingStatus } from '@/services/booking.service';

export default defineComponent({
  name: 'BookingCard',
  props: {
    booking: {
      type: Object as () => Booking,
      required: true,
    },
    viewAs: {
      type: String as () => 'student' | 'tutor',
      default: 'student',
    },
    hasReviewedTutor: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['view', 'viewPayment', 'viewSummary', 'cancel', 'confirm', 'complete', 'studentComplete', 'review'],
  computed: {
    userName(): string {
      return this.viewAs === 'student'
        ? this.booking.tutor.fullName
        : this.booking.student.fullName;
    },
    userImage(): string {
      const user = this.viewAs === 'student' ? this.booking.tutor : this.booking.student;
      return (
        user.profileImageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=93c5fd&color=fff`
      );
    },
    formattedDate(): string {
      const date = new Date(this.booking.bookingDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formattedPrice(): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.booking.totalPrice);
    },
    statusClass(): string {
      const classes: Record<BookingStatus, string> = {
        pending_payment: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
      };
      return classes[this.booking.status] || 'bg-gray-100 text-gray-700';
    },
    statusLabel(): string {
      if (this.booking.status === 'confirmed' && this.booking.tutorCompleted && !this.booking.studentCompleted) {
        return 'Awaiting Confirmation';
      }
      const labels: Record<BookingStatus, string> = {
        pending_payment: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      };
      return labels[this.booking.status] || this.booking.status;
    },
    isSessionEnded(): boolean {
      const bookingEnd = new Date(
        `${this.booking.bookingDate}T${this.booking.startTime}`,
      );
      bookingEnd.setHours(bookingEnd.getHours() + this.booking.durationHours);
      return new Date() >= bookingEnd;
    },
    showLocationInfo(): boolean {
      return this.booking.status === 'confirmed';
    },
    showViewPaymentButton(): boolean {
      return (
        this.viewAs === 'tutor' &&
        this.booking.status === 'pending_payment'
      );
    },
    showViewSummaryButton(): boolean {
      return (
        (this.booking.status === 'completed' ||
          (this.booking.status === 'confirmed' && this.booking.tutorCompleted))
      );
    },
    showCancelButton(): boolean {
      if (this.booking.tutorCompleted) return false;
      return (
        this.booking.status === 'pending_payment' ||
        this.booking.status === 'confirmed'
      );
    },
    showConfirmButton(): boolean {
      return (
        this.viewAs === 'tutor' && this.booking.status === 'pending_payment'
      );
    },
    showTutorCompleteButton(): boolean {
      if (this.viewAs !== 'tutor' || this.booking.status !== 'confirmed') {
        return false;
      }
      if (this.booking.tutorCompleted) {
        return false;
      }
      return this.isSessionEnded;
    },
    showStudentCompleteButton(): boolean {
      if (this.viewAs !== 'student' || this.booking.status !== 'confirmed') {
        return false;
      }
      return this.booking.tutorCompleted && !this.booking.studentCompleted;
    },
    showReviewButton(): boolean {
      return (
        this.viewAs === 'student' &&
        this.booking.status === 'completed' &&
        !this.hasReviewedTutor
      );
    },
    showJoinButton(): boolean {
      return (
        this.booking.status === 'confirmed' &&
        this.booking.teachingMethod === 'online' &&
        !!this.booking.meetingUrl
      );
    },
  },
});
</script>
