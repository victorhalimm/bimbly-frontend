<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="text-sm text-green-800">{{ success }}</div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-800">{{ error }}</div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-500">
            Back to login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

export default defineComponent({
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      error: null as string | null,
      success: null as string | null,
    };
  },
  computed: {
    loading() {
      return useAuthStore().loading;
    },
  },
  methods: {
    async handleForgotPassword() {
      this.error = null;
      this.success = null;
      const authStore = useAuthStore();

      try {
        await authStore.forgotPassword(this.email);
        this.success = 'Password reset email sent! Check your email for the reset link.';
        this.email = '';
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to send reset email';
      }
    },
  },
});
</script>
