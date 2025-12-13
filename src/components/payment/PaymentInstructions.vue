<template>
  <div class="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-6">
    <div class="text-center" v-if="instructions.type === 'QR Code'">
      <div class="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        <IconQrcode class="w-24 h-24 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500">Scan this QR code with your e-wallet app</p>
    </div>

    <div v-else-if="instructions.type === 'Virtual Account'" class="text-center">
      <p class="text-sm text-gray-500 mb-2">Transfer to {{ instructions.bank }} Virtual Account</p>
      <div class="flex items-center justify-center gap-3">
        <span class="text-2xl font-mono font-bold text-gray-900 tracking-wider">
          {{ instructions.vaNumber }}
        </span>
        <button
          type="button"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          @click="copyVANumber"
        >
          <IconCopy class="w-5 h-5" />
        </button>
      </div>
      <p v-if="copied" class="text-sm text-green-600 mt-2">Copied!</p>
    </div>

    <div v-else-if="instructions.type === 'E-Wallet'" class="text-center">
      <p class="text-sm text-gray-500 mb-4">Pay with your e-wallet app</p>
      <a
        :href="instructions.deepLink"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        <IconExternalLink class="w-5 h-5" />
        Open App
      </a>
    </div>

    <div class="border-t border-gray-100 pt-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-gray-600">Amount to Pay</span>
        <span class="text-2xl font-black text-blue-600">{{ formattedAmount }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">Payment expires in</span>
        <span
          class="font-mono font-semibold"
          :class="isExpiringSoon ? 'text-red-600' : 'text-gray-700'"
        >
          {{ timeRemaining }}
        </span>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-6">
      <h4 class="font-semibold text-gray-900 mb-3">How to Pay</h4>
      <ol class="space-y-2">
        <li
          v-for="(step, index) in instructions.steps"
          :key="index"
          class="flex gap-3 text-sm text-gray-600"
        >
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center text-xs">
            {{ index + 1 }}
          </span>
          <span>{{ step }}</span>
        </li>
      </ol>
    </div>

    <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div class="flex gap-3">
        <IconAlertTriangle class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-yellow-800">
          <p class="font-semibold mb-1">Demo Payment System</p>
          <p>This is a demonstration. No actual payment will be processed.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import {
  IconQrcode,
  IconCopy,
  IconExternalLink,
  IconAlertTriangle,
} from '@tabler/icons-vue';
import type { PaymentInstructions } from '@/services/payment.service';

export default defineComponent({
  name: 'PaymentInstructions',
  components: {
    IconQrcode,
    IconCopy,
    IconExternalLink,
    IconAlertTriangle,
  },
  props: {
    instructions: {
      type: Object as PropType<PaymentInstructions>,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      copied: false,
      timeRemaining: '',
      isExpiringSoon: false,
      timer: null as ReturnType<typeof setInterval> | null,
    };
  },
  computed: {
    formattedAmount(): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(this.amount);
    },
  },
  mounted() {
    this.updateTimeRemaining();
    this.timer = setInterval(() => this.updateTimeRemaining(), 1000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async copyVANumber() {
      if (this.instructions.vaNumber) {
        await navigator.clipboard.writeText(this.instructions.vaNumber);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }
    },
    updateTimeRemaining() {
      const now = new Date().getTime();
      const expiry = new Date(this.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        this.timeRemaining = 'Expired';
        this.isExpiringSoon = true;
        if (this.timer) {
          clearInterval(this.timer);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.timeRemaining = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.isExpiringSoon = hours < 1;
    },
  },
});
</script>
