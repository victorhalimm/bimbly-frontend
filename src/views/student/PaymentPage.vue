<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-blue-100 pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

      <div class="max-w-4xl mx-auto">
        <button
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
          @click="handleBack"
        >
          <IconArrowLeft class="w-5 h-5" />
          Back
        </button>
        <h1 class="text-3xl md:text-4xl font-black text-gray-900">Complete Payment</h1>
        <p class="text-gray-600 mt-2">Choose your payment method and complete the transaction</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
      <div v-if="loading" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-500 mt-4">Loading payment details...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconAlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Error</h3>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <button
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all"
          @click="$router.push('/student/bookings')"
        >
          View My Bookings
        </button>
      </div>

      <div v-else-if="booking" class="space-y-6">
        <div class="bg-white rounded-[2rem] shadow-xl p-6">
          <h3 class="font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div class="flex items-center gap-4">
            <img
              :src="tutorAvatar"
              :alt="booking.tutorName"
              class="w-16 h-16 rounded-full object-cover bg-blue-100"
            />
            <div class="flex-1">
              <h4 class="font-bold text-gray-900">{{ booking.tutorName }}</h4>
              <p class="text-sm text-gray-600">{{ booking.subject }}</p>
              <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <IconCalendar class="w-4 h-4" />
                  {{ formattedDate }}
                </span>
                <span class="flex items-center gap-1">
                  <IconClock class="w-4 h-4" />
                  {{ booking.startTime }} ({{ booking.durationHours }}h)
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Total</p>
              <p class="text-2xl font-black text-blue-600">{{ formattedPrice }}</p>
            </div>
          </div>
        </div>

        <div v-if="!payment" class="bg-white rounded-[2rem] shadow-xl p-6">
          <h3 class="font-bold text-gray-900 mb-4">Select Payment Method</h3>
          <PaymentMethodSelector
            :methods="paymentMethods"
            :selected="selectedMethod"
            @select="selectedMethod = $event"
          />

          <div class="flex gap-4 mt-6">
            <button
              type="button"
              class="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!selectedMethod || initiating"
              @click="initiatePayment"
            >
              <span v-if="initiating" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
              <span v-else>Continue to Pay</span>
            </button>
            <button
              type="button"
              class="px-6 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              @click="payLater"
            >
              Pay Later
            </button>
          </div>
        </div>

        <template v-if="payment">
          <PaymentInstructions
            :instructions="payment.paymentInstructions"
            :amount="payment.amount"
            :expires-at="payment.expiresAt"
          />

          <PaymentProofUpload
            v-if="payment.status === 'pending'"
            :uploading="uploading"
            @upload="uploadProof"
          />

          <div
            v-if="payment.status === 'pending_verification'"
            class="bg-white rounded-[2rem] shadow-xl p-6 text-center"
          >
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconClockHour4 class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Waiting for Verification</h3>
            <p class="text-gray-600 mb-4">
              Your payment proof has been uploaded. The tutor will verify your payment shortly.
            </p>
            <p class="text-sm text-gray-500">Transaction ID: {{ payment.transactionId }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCalendar,
  IconClock,
  IconClockHour4,
} from '@tabler/icons-vue';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import type { Payment, PaymentMethod, PaymentMethodId } from '@/services/payment.service';
import { useToast } from '@/composables/useToast';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector.vue';
import PaymentInstructions from '@/components/payment/PaymentInstructions.vue';
import PaymentProofUpload from '@/components/payment/PaymentProofUpload.vue';

interface BookingDetails {
  id: string;
  tutorName: string;
  tutorImageUrl: string | null;
  subject: string;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  totalPrice: number;
}

export default defineComponent({
  name: 'PaymentPage',
  components: {
    IconArrowLeft,
    IconAlertCircle,
    IconCalendar,
    IconClock,
    IconClockHour4,
    PaymentMethodSelector,
    PaymentInstructions,
    PaymentProofUpload,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      loading: true,
      error: null as string | null,
      booking: null as BookingDetails | null,
      payment: null as Payment | null,
      paymentMethods: [] as PaymentMethod[],
      selectedMethod: null as PaymentMethodId | null,
      initiating: false,
      uploading: false,
    };
  },
  computed: {
    bookingId(): string {
      return this.$route.params.bookingId as string;
    },
    tutorAvatar(): string {
      if (this.booking?.tutorImageUrl) {
        return this.booking.tutorImageUrl;
      }
      const name = this.booking?.tutorName || 'Tutor';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
    },
    formattedDate(): string {
      if (!this.booking) return '';
      return new Date(this.booking.bookingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formattedPrice(): string {
      if (!this.booking) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(this.booking.totalPrice);
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;

      try {
        const [bookingData, methodsResponse] = await Promise.all([
          bookingService.getBookingById(this.bookingId),
          paymentService.getPaymentMethods(),
        ]);

        this.booking = {
          id: bookingData.bookingId,
          tutorName: bookingData.tutorName,
          tutorImageUrl: bookingData.tutorImageUrl || null,
          subject: bookingData.subject,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          durationHours: bookingData.durationHours,
          totalPrice: bookingData.totalPrice,
        };

        this.paymentMethods = methodsResponse.methods;

        const existingPayment = await paymentService.getPaymentByBooking(this.bookingId);
        if (existingPayment) {
          this.payment = existingPayment;
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to load payment details';
      } finally {
        this.loading = false;
      }
    },
    async initiatePayment() {
      if (!this.selectedMethod) return;

      this.initiating = true;
      try {
        const response = await paymentService.initiatePayment(this.bookingId, this.selectedMethod);
        this.payment = {
          id: response.paymentId,
          bookingId: this.bookingId,
          amount: response.amount,
          paymentMethod: response.paymentMethod,
          transactionId: response.transactionId,
          status: response.status,
          paymentInstructions: response.instructions,
          paymentProofUrl: null,
          expiresAt: response.expiresAt,
          createdAt: new Date().toISOString(),
        };
        this.toast.success('Payment Initiated', 'Please complete the payment and upload proof');
      } catch (err: any) {
        this.toast.error('Error', err.response?.data?.message || 'Failed to initiate payment');
      } finally {
        this.initiating = false;
      }
    },
    async uploadProof(file: File) {
      if (!this.payment) return;

      this.uploading = true;
      try {
        const response = await paymentService.uploadPaymentProof(this.payment.id, file);
        this.payment.status = response.status;
        this.payment.paymentProofUrl = response.paymentProofUrl;
        this.toast.success('Proof Uploaded', 'Waiting for tutor verification');
      } catch (err: any) {
        this.toast.error('Upload Failed', err.response?.data?.message || 'Failed to upload proof');
      } finally {
        this.uploading = false;
      }
    },
    payLater() {
      this.toast.info('Pay Later', 'You can complete payment from your bookings page');
      this.$router.push('/student/bookings');
    },
    handleBack() {
      if (this.payment) {
        this.$router.push('/student/bookings');
      } else {
        this.$router.back();
      }
    },
  },
});
</script>
