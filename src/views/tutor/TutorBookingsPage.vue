<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-blue-100 pt-24 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
      <div class="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <h1 class="text-3xl md:text-4xl font-black text-gray-900">Booking Requests</h1>
        <p class="text-gray-600 mt-2">Manage your student bookings and sessions</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-[2rem] shadow-lg p-2 mb-8">
        <div class="flex overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all"
            :class="activeTab === tab.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
            <span
              v-if="tab.count > 0"
              class="ml-2 px-2 py-0.5 text-xs rounded-full"
              :class="activeTab === tab.value
                ? 'bg-white/20 text-white'
                : tab.value === 'pending' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-600'"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-[2rem] p-6 animate-pulse shadow-lg">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
              <div class="grid grid-cols-2 gap-2">
                <div class="h-4 bg-gray-100 rounded"></div>
                <div class="h-4 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="bg-white rounded-[2rem] shadow-lg p-12 text-center">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
        <p class="text-gray-500">{{ emptyStateMessage }}</p>
      </div>

      <div v-else class="space-y-4">
        <BookingCard
          v-for="booking in filteredBookings"
          :key="booking.bookingId"
          :booking="booking"
          view-as="tutor"
          @view="handleView"
          @viewPayment="openPaymentProofModal"
          @viewSummary="openViewSummaryModal"
          @cancel="openCancelModal"
          @confirm="openConfirmModal"
          @complete="openCompleteModal"
        />
      </div>

      <div v-if="totalPages > 1 && !loading" class="mt-8 flex items-center justify-center gap-2">
        <button
          :disabled="currentPage === 1"
          class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          @click="handlePageChange(currentPage - 1)"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="min-w-[40px] h-10 rounded-xl font-medium transition-all"
            :class="page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage === totalPages"
          class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          @click="handlePageChange(currentPage + 1)"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeConfirmModal"
    >
      <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
        <p class="text-gray-600 mb-6">Confirm this booking request from the student.</p>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Meeting URL (for online sessions)</label>
          <input
            v-model="meetingUrl"
            type="url"
            placeholder="https://meet.google.com/..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
          <p class="text-xs text-gray-400 mt-1">Optional: Add a meeting link for online sessions</p>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="closeConfirmModal"
          >
            Cancel
          </button>
          <button
            :disabled="confirming"
            class="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
            @click="handleConfirm"
          >
            {{ confirming ? 'Confirming...' : 'Confirm Booking' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeCancelModal"
    >
      <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Decline Booking</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to decline this booking? Please provide a reason.</p>
        <textarea
          v-model="cancelReason"
          rows="3"
          placeholder="Reason for declining..."
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
        ></textarea>
        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            @click="closeCancelModal"
          >
            Keep Request
          </button>
          <button
            :disabled="!cancelReason.trim() || cancelling"
            class="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleCancel"
          >
            {{ cancelling ? 'Declining...' : 'Decline Booking' }}
          </button>
        </div>
      </div>
    </div>

    <CreateSessionSummaryModal
      v-if="showCompleteModal && selectedBookingId"
      :booking-id="selectedBookingId"
      :submitting="completing"
      @close="closeCompleteModal"
      @submit="handleComplete"
    />

    <ViewPaymentProofModal
      v-if="showPaymentProofModal"
      :image-url="paymentProofUrl"
      :loading="loadingPaymentProof"
      @close="closePaymentProofModal"
    />

    <ViewSessionSummaryModal
      v-if="showViewSummaryModal"
      :summary="sessionSummary"
      :loading="loadingSummary"
      view-as="tutor"
      @close="closeViewSummaryModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useBookingStore } from '@/stores/booking.store';
import { useToast } from '@/composables/useToast';
import { sessionSummariesService } from '@/services/session-summaries.service';
import { paymentService } from '@/services/payment.service';
import BookingCard from '@/components/booking/BookingCard.vue';
import CreateSessionSummaryModal from '@/components/booking/CreateSessionSummaryModal.vue';
import ViewPaymentProofModal from '@/components/booking/ViewPaymentProofModal.vue';
import ViewSessionSummaryModal from '@/components/booking/ViewSessionSummaryModal.vue';
import type { Booking } from '@/services/booking.service';
import type { SessionSummary, CreateSessionSummaryDto } from '@/services/session-summaries.service';

interface TabItem {
  value: string;
  label: string;
  count: number;
}

export default defineComponent({
  name: 'TutorBookingsPage',
  components: {
    BookingCard,
    CreateSessionSummaryModal,
    ViewPaymentProofModal,
    ViewSessionSummaryModal,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      activeTab: 'pending',
      showConfirmModal: false,
      showCancelModal: false,
      showCompleteModal: false,
      showPaymentProofModal: false,
      showViewSummaryModal: false,
      selectedBookingId: null as string | null,
      meetingUrl: '',
      cancelReason: '',
      confirming: false,
      cancelling: false,
      completing: false,
      paymentProofUrl: null as string | null,
      loadingPaymentProof: false,
      sessionSummary: null as SessionSummary | null,
      loadingSummary: false,
    };
  },
  computed: {
    bookingStore() {
      return useBookingStore();
    },
    bookings(): Booking[] {
      return this.bookingStore.bookings;
    },
    loading() {
      return this.bookingStore.loading;
    },
    error() {
      return this.bookingStore.error;
    },
    currentPage() {
      return this.bookingStore.meta.page;
    },
    totalPages() {
      return this.bookingStore.meta.totalPages;
    },
    tabs(): TabItem[] {
      return [
        { value: 'pending', label: 'Pending', count: this.pendingCount },
        { value: 'confirmed', label: 'Confirmed', count: this.confirmedCount },
        { value: 'completed', label: 'Completed', count: this.completedCount },
        { value: 'cancelled', label: 'Cancelled', count: this.cancelledCount },
      ];
    },
    filteredBookings(): Booking[] {
      switch (this.activeTab) {
        case 'pending':
          return this.bookings.filter((b) => b.status === 'pending_payment');
        case 'confirmed':
          return this.bookings.filter((b) => b.status === 'confirmed');
        case 'completed':
          return this.bookings.filter((b) => b.status === 'completed');
        case 'cancelled':
          return this.bookings.filter((b) => b.status === 'cancelled');
        default:
          return this.bookings;
      }
    },
    pendingCount(): number {
      return this.bookings.filter((b) => b.status === 'pending_payment').length;
    },
    confirmedCount(): number {
      return this.bookings.filter((b) => b.status === 'confirmed').length;
    },
    completedCount(): number {
      return this.bookings.filter((b) => b.status === 'completed').length;
    },
    cancelledCount(): number {
      return this.bookings.filter((b) => b.status === 'cancelled').length;
    },
    emptyStateMessage(): string {
      switch (this.activeTab) {
        case 'pending':
          return 'No pending booking requests.';
        case 'confirmed':
          return 'No confirmed sessions.';
        case 'completed':
          return 'No completed sessions yet.';
        case 'cancelled':
          return 'No cancelled bookings.';
        default:
          return 'No bookings found.';
      }
    },
    visiblePages(): number[] {
      const pages: number[] = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    error(newError: string | null) {
      if (newError) {
        this.toast.error('Error', newError);
      }
    },
  },
  mounted() {
    this.loadBookings();
  },
  methods: {
    async loadBookings() {
      this.bookingStore.resetFilters();
      await this.bookingStore.fetchBookings();
    },
    handleTabChange(tab: string) {
      this.activeTab = tab;
    },
    handlePageChange(page: number) {
      this.bookingStore.setPage(page);
    },
    handleView(bookingId: string) {
      this.$router.push(`/tutor/bookings/${bookingId}`);
    },
    openConfirmModal(bookingId: string) {
      this.selectedBookingId = bookingId;
      this.meetingUrl = '';
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
      this.selectedBookingId = null;
      this.meetingUrl = '';
    },
    async handleConfirm() {
      if (!this.selectedBookingId) return;

      this.confirming = true;
      try {
        await this.bookingStore.confirmBooking(
          this.selectedBookingId,
          this.meetingUrl || undefined,
        );
        this.toast.success('Booking Confirmed', 'The booking has been confirmed successfully');
        this.closeConfirmModal();
      } catch {
      } finally {
        this.confirming = false;
      }
    },
    openCancelModal(bookingId: string) {
      this.selectedBookingId = bookingId;
      this.cancelReason = '';
      this.showCancelModal = true;
    },
    closeCancelModal() {
      this.showCancelModal = false;
      this.selectedBookingId = null;
      this.cancelReason = '';
    },
    async handleCancel() {
      if (!this.selectedBookingId || !this.cancelReason.trim()) return;

      this.cancelling = true;
      try {
        await this.bookingStore.cancelBooking(this.selectedBookingId, this.cancelReason);
        this.toast.success('Booking Declined', 'The booking has been declined');
        this.closeCancelModal();
      } catch {
      } finally {
        this.cancelling = false;
      }
    },
    openCompleteModal(bookingId: string) {
      this.selectedBookingId = bookingId;
      this.showCompleteModal = true;
    },
    closeCompleteModal() {
      this.showCompleteModal = false;
      this.selectedBookingId = null;
    },
    async handleComplete(summaryData: CreateSessionSummaryDto) {
      this.completing = true;
      try {
        await sessionSummariesService.create(summaryData);
        await this.bookingStore.completeBooking(summaryData.bookingId);
        this.toast.success('Session Completed', 'Session summary created and session marked as completed');
        this.closeCompleteModal();
      } catch {
        this.toast.error('Error', 'Failed to complete session');
      } finally {
        this.completing = false;
      }
    },
    async openPaymentProofModal(bookingId: string) {
      this.showPaymentProofModal = true;
      this.loadingPaymentProof = true;
      this.paymentProofUrl = null;

      try {
        const payment = await paymentService.getPaymentByBooking(bookingId);
        this.paymentProofUrl = payment?.paymentProofUrl || null;
      } catch {
        this.toast.error('Error', 'Failed to load payment proof');
      } finally {
        this.loadingPaymentProof = false;
      }
    },
    closePaymentProofModal() {
      this.showPaymentProofModal = false;
      this.paymentProofUrl = null;
    },
    async openViewSummaryModal(bookingId: string) {
      this.showViewSummaryModal = true;
      this.loadingSummary = true;
      this.sessionSummary = null;

      try {
        this.sessionSummary = await sessionSummariesService.getByBooking(bookingId);
      } catch {
        this.toast.error('Error', 'Failed to load session summary');
      } finally {
        this.loadingSummary = false;
      }
    },
    closeViewSummaryModal() {
      this.showViewSummaryModal = false;
      this.sessionSummary = null;
    },
  },
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
