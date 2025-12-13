<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="method in methods"
        :key="method.id"
        type="button"
        class="p-4 rounded-xl border-2 text-left transition-all hover:shadow-md"
        :class="selected === method.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="$emit('select', method.id)"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <component :is="getMethodIcon(method.id)" class="w-6 h-6 text-gray-600" />
          </div>
          <div class="flex-1">
            <p class="font-semibold text-gray-900">{{ method.name }}</p>
            <p class="text-xs text-gray-500">{{ method.description }}</p>
          </div>
          <div
            v-if="selected === method.id"
            class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <IconCheck class="w-4 h-4 text-white" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import {
  IconQrcode,
  IconBuildingBank,
  IconWallet,
  IconCheck,
} from '@tabler/icons-vue';
import type { PaymentMethod, PaymentMethodId } from '@/services/payment.service';

export default defineComponent({
  name: 'PaymentMethodSelector',
  components: {
    IconQrcode,
    IconBuildingBank,
    IconWallet,
    IconCheck,
  },
  props: {
    methods: {
      type: Array as PropType<PaymentMethod[]>,
      required: true,
    },
    selected: {
      type: String as PropType<PaymentMethodId | null>,
      default: null,
    },
  },
  emits: ['select'],
  methods: {
    getMethodIcon(methodId: PaymentMethodId) {
      if (methodId === 'qris') return 'IconQrcode';
      if (methodId.startsWith('va_')) return 'IconBuildingBank';
      return 'IconWallet';
    },
  },
});
</script>
