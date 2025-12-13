<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-blue-100 pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-black text-gray-900">Payment Verification</h1>
        <p class="text-gray-600 mt-2">Review and verify student payment proofs</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
      <div v-if="loading" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-500 mt-4">Loading pending payments...</p>
      </div>

      <div v-else-if="pendingPayments.length === 0" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconCheck class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
        <p class="text-gray-500">No pending payment verifications at the moment.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="payment in pendingPayments"
          :key="payment.id"
          class="bg-white rounded-[2rem] shadow-xl p-6"
        >
          <div class="flex items-center gap-4">
            <img
              :src="getStudentAvatar(payment.student)"
              :alt="payment.student.fullName"
              class="w-14 h-14 rounded-full object-cover bg-blue-100"
            />
            <div class="flex-1">
              <h4 class="font-bold text-gray-900">{{ payment.student.fullName }}</h4>
              <p class="text-sm text-gray-600">{{ payment.booking.subject }}</p>
              <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <IconCalendar class="w-4 h-4" />
                  {{ formatDate(payment.booking.bookingDate) }}
                </span>
                <span class="flex items-center gap-1">
                  <IconClock class="w-4 h-4" />
                  {{ payment.booking.startTime }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-blue-600">{{ formatPrice(payment.amount) }}</p>
              <p class="text-xs text-gray-500">{{ getMethodName(payment.paymentMethod) }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p class="text-sm text-gray-500">
              Submitted {{ formatTimeAgo(payment.createdAt) }}
            </p>
            <button
              type="button"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              @click="openProofModal(payment)"
            >
              View Proof
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedPayment"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeProofModal"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Payment Proof</h3>
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              @click="closeProofModal"
            >
              <IconX class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <img
              :src="getProofUrl(selectedPayment.paymentProofUrl)"
              alt="Payment proof"
              class="w-full rounded-xl cursor-zoom-in"
              :class="isZoomed ? 'scale-150 cursor-zoom-out' : ''"
              @click="isZoomed = !isZoomed"
            />
            <p class="text-center text-sm text-gray-500 mt-2">Click image to zoom</p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Student</p>
              <p class="font-semibold text-gray-900">{{ selectedPayment.student.fullName }}</p>
            </div>
            <div>
              <p class="text-gray-500">Amount</p>
              <p class="font-semibold text-blue-600">{{ formatPrice(selectedPayment.amount) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Transaction ID</p>
              <p class="font-mono text-gray-900">{{ selectedPayment.transactionId }}</p>
            </div>
            <div>
              <p class="text-gray-500">Payment Method</p>
              <p class="font-semibold text-gray-900">{{ getMethodName(selectedPayment.paymentMethod) }}</p>
            </div>
          </div>

          <div class="flex gap-4 mt-6">
            <button
              type="button"
              class="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              :disabled="processing"
              @click="approvePayment"
            >
              <IconCheck class="w-5 h-5" />
              Approve
            </button>
            <button
              type="button"
              class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              :disabled="processing"
              @click="showRejectModal = true"
            >
              <IconX class="w-5 h-5" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showRejectModal = false"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reject Payment</h3>
        <p class="text-gray-600 mb-4">Please provide a reason for rejecting this payment:</p>
        <textarea
          v-model="rejectionReason"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
          rows="3"
          placeholder="e.g., Payment proof is unclear, amount doesn't match..."
        ></textarea>
        <div class="flex gap-4 mt-6">
          <button
            type="button"
            class="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            @click="showRejectModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
            :disabled="!rejectionReason.trim() || processing"
            @click="rejectPayment"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconCheck,
  IconX,
  IconCalendar,
  IconClock,
} from '@tabler/icons-vue';
import { paymentService } from '@/services/payment.service';
import type { PendingVerificationItem } from '@/services/payment.service';
import { useToast } from '@/composables/useToast';

const API_URL = import.meta.env.VITE_API_URL;

export default defineComponent({
  name: 'TutorPaymentVerification',
  components: {
    IconCheck,
    IconX,
    IconCalendar,
    IconClock,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      loading: true,
      pendingPayments: [] as PendingVerificationItem[],
      selectedPayment: null as PendingVerificationItem | null,
      showRejectModal: false,
      rejectionReason: '',
      processing: false,
      isZoomed: false,
    };
  },
  async mounted() {
    await this.loadPendingPayments();
  },
  methods: {
    async loadPendingPayments() {
      this.loading = true;
      try {
        const response = await paymentService.getPendingVerifications();
        this.pendingPayments = response.payments;
      } catch (err: any) {
        this.toast.error('Error', err.response?.data?.message || 'Failed to load pending payments');
      } finally {
        this.loading = false;
      }
    },
    getStudentAvatar(student: { fullName: string; profileImageUrl: string | null }): string {
      if (student.profileImageUrl) {
        return student.profileImageUrl;
      }
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=3b82f6&color=fff`;
    },
    getProofUrl(url: string): string {
      if (url.startsWith('http')) return url;
      return `${API_URL}${url}`;
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    },
    formatPrice(amount: number): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    },
    formatTimeAgo(date: string): string {
      const now = new Date();
      const past = new Date(date);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    },
    getMethodName(method: string): string {
      const names: Record<string, string> = {
        qris: 'QRIS',
        va_bca: 'VA BCA',
        va_mandiri: 'VA Mandiri',
        va_bni: 'VA BNI',
        gopay: 'GoPay',
        ovo: 'OVO',
        dana: 'DANA',
      };
      return names[method] || method;
    },
    openProofModal(payment: PendingVerificationItem) {
      this.selectedPayment = payment;
      this.isZoomed = false;
    },
    closeProofModal() {
      this.selectedPayment = null;
      this.isZoomed = false;
    },
    async approvePayment() {
      if (!this.selectedPayment) return;

      this.processing = true;
      try {
        await paymentService.verifyPayment(this.selectedPayment.id);
        this.toast.success('Payment Approved', 'The booking has been confirmed');
        this.pendingPayments = this.pendingPayments.filter(p => p.id !== this.selectedPayment!.id);
        this.closeProofModal();
      } catch (err: any) {
        this.toast.error('Error', err.response?.data?.message || 'Failed to approve payment');
      } finally {
        this.processing = false;
      }
    },
    async rejectPayment() {
      if (!this.selectedPayment || !this.rejectionReason.trim()) return;

      this.processing = true;
      try {
        await paymentService.rejectPayment(this.selectedPayment.id, this.rejectionReason.trim());
        this.toast.success('Payment Rejected', 'The student has been notified');
        this.pendingPayments = this.pendingPayments.filter(p => p.id !== this.selectedPayment!.id);
        this.showRejectModal = false;
        this.rejectionReason = '';
        this.closeProofModal();
      } catch (err: any) {
        this.toast.error('Error', err.response?.data?.message || 'Failed to reject payment');
      } finally {
        this.processing = false;
      }
    },
  },
});
</script>
